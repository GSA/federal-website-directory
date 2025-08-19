import {DataFrame} from 'dataframe-js';
import csvParser from 'csv-parser';
import * as fs from 'fs';
import axios from 'axios';
import {Readable} from "node:stream";
import * as path from 'path';

interface WebsiteInventory {
    agency: string;
    website_inventory: string;
}

async function downloadAllCsvFiles(inventoryPath: string, snapshotPath: string) {
    return new Promise<void>((resolve) => {
        const rows: WebsiteInventory[] = [];
        const inventoryStream = fs.createReadStream(inventoryPath, { encoding: 'utf8' });

        inventoryStream
            .pipe(csvParser())
            .on('data', (row) => {
                const url = row.website_inventory;
                if (row.website_inventory) rows.push(row);
            })
            .on('end', async () => {
                const tasks = rows.map(async (inventory) => {
                    const url = inventory.website_inventory;
                    try {
                        const domain = retrieveDomainFromUrl(url);
                        const savePath = `${snapshotPath}${domain}.csv`;

                        let df;
                        const response = await axios.get(inventory.website_inventory, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                                'Accept': 'text/csv,text/plain,*/*'
                            },
                            responseType: 'text',
                            maxRedirects: 5,
                            validateStatus: (status) => status < 500,
                        });
                        if (!response.status || response.status !== 200) {
                            console.warn(`There was an issue loading the CSV from ${inventory.agency}: ${inventory.website_inventory} (HTTP ${response.status}). Skipping...`);
                            return null;
                        }

                        const currentCsvText = await response.data;
                        const currentCsvRows: any[] = [];

                        await new Promise<void>((res) => {
                            Readable.from([currentCsvText])
                                .pipe(csvParser())
                                .on('data', (r) => currentCsvRows.push(r))
                                .on('end', () => res())
                                .on('error', (error) => {
                                    console.warn(`Skipping ${inventory.agency} due to parse error: ${error.message}`);
                                    res();
                                });
                        });

                        if (currentCsvRows.length === 0) return null;

                        const currentData = new DataFrame(currentCsvRows);
                        if (currentData.listColumns().length < 4) {
                            console.warn(`Skipping ${inventory.agency}: less than 4 columns`);
                            return null;
                        }
                        let selectedInventories;
                        try {
                            selectedInventories = currentData.select("Website", "Agency", "Bureau", "Office");
                        } catch (error: any) {
                            console.warn(`Skipping ${inventory.agency} due to missing valid headers: ${error?.message ?? error}`);
                            return null;
                        }
                        try {
                            selectedInventories.toCSV(true, savePath);
                        } catch (error: any) {
                            console.warn(`Skipping due to save error (${savePath}): ${error?.message ?? error}`);
                            resolve();
                        }

                    } catch (error: any) {
                        console.warn(`Skipping due to unexpected error (${url}): ${error?.message ?? error}`);
                        resolve();
                    }
                });

                try {
                    const settled = await Promise.allSettled(tasks);
                    const saved = settled.filter(s => s.status === 'fulfilled' && s.value !== null).length;
                    const skipped = settled.length - saved;
                    console.log(`Finished parsing website inventory data. Saved: ${saved}, Skipped: ${skipped}`);
                    resolve();
                } catch (error: any) {
                    console.warn(`Finished with errors: ${error?.message ?? error}`);
                }
            })
            .on('error', (error) => {
                console.warn(`There was an issue reading the inventory CSV (${inventoryPath}): ${error?.message ?? error}. Skipping file.`);
                resolve(); // do not reject; finish gracefully
            });
    });
}

function retrieveDomainFromUrl(url: string): string {
    const match = url.match(/^https?:\/\/(?:www\.)?([^.\/]+)/i)
    // @ts-ignore
    return match ? match[1] : "empty";
}

async function combineDataFrames(
    websideInventoriesFilePaths: string[] | null,
    outputCsvPath: string
) {
    if (!websideInventoriesFilePaths || websideInventoriesFilePaths.length === 0) {
        console.warn('No valid DataFrames to combine.');
        return;
    }

    let combinedDf: DataFrame = new DataFrame([]);
    for (let i = 0; i < websideInventoriesFilePaths.length; i++) {
        console.log(`Loading ${websideInventoriesFilePaths[i]}`);
        const currentDf = await DataFrame.fromCSV(websideInventoriesFilePaths[i]);
        combinedDf = combinedDf.union(currentDf);
    }
    combinedDf.toCSV(true, outputCsvPath);
    console.log(`Combined CSV saved to ${outputCsvPath}`);
}

function getCsvFiles(dir: string): string[] {
    let snapshotPath = path.resolve(process.cwd(), dir)
    const entries = fs.readdirSync(snapshotPath, { withFileTypes: true });
    return entries
        .filter(e => e.isFile() && path.extname(e.name).toLowerCase() === '.csv')
        .map(e => path.join(snapshotPath, e.name));

}

async function main() {
    // load data
    const inventoryFilePath = './website_inventories.csv';
    const snapshotFilePath = '../snapshots/';
    const publishPath = '../publish/';

    // aggregate csvs
    try {
        await downloadAllCsvFiles(inventoryFilePath, snapshotFilePath);
        await combineDataFrames(
            getCsvFiles(snapshotFilePath),
            publishPath + 'us-gov-public-website-inventory.csv'
        );
        console.log('Download and storage complete.');
    } catch (error) {
        console.error(error);
    }
}

main().catch(error => console.error(error));