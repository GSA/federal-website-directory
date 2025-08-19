import {DataFrame} from 'dataframe-js';
import csvParser from 'csv-parser';
import * as fs from 'fs';
// import fetch from 'node-fetch';
import axios from 'axios';
import {Readable} from "node:stream";

interface WebsiteInventory {
    agency: string;
    website_inventory: string;
}

async function downloadAndLoad(inventoryPath: string, snapshotPath: string): Promise<DataFrame[] | null> {
    return new Promise((resolve, reject) => {
        const results: WebsiteInventory[] = [];
        const inventoryStream = fs.createReadStream(inventoryPath, { encoding: 'utf8' });

        inventoryStream
            .pipe(csvParser())
            .on('data', (row: WebsiteInventory) => {
                if (row.website_inventory) results.push(row);
            })
            .on('end', async () => {
                try {
                    const promises = results.map(async (inventory) => {
                        try {
                            const response = await axios.get(inventory.website_inventory, {
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                                    'Accept': 'text/csv,text/plain,*/*'
                                },
                                responseType: 'text'
                            });
                            console.log(response.status, response.headers)
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

                            const domain = retrieveDomainFromUrl(inventory.website_inventory);
                            const savePath = `${snapshotPath}${domain}.csv`;
                            selectedInventories.toCSV(true, savePath);
                            return currentData;
                        } catch (err: any) {
                            console.warn(`There was an issue loading the CSV from ${inventory.agency}: ${inventory.website_inventory}. ${err?.message ?? err}. Skipping...`);
                            return null;
                        }
                    });

                    const settled = await Promise.allSettled(promises);
                    const dataFrames = settled
                        .filter((r): r is PromiseFulfilledResult<DataFrame | null> => r.status === 'fulfilled')
                        .map((r) => r.value)
                        .filter((df): df is DataFrame => df !== null);

                    resolve(dataFrames);
                } catch (err: any) {
                    console.warn(`Unexpected error while processing inventory list: ${err?.message ?? err}`);
                    resolve(null);
                }
            })
            .on('error', (error) => {
                console.warn(`There was an issue reading the inventory CSV ${inventoryPath}: ${error.message}`);
                reject(error);
            });
    });
}

function retrieveDomainFromUrl(url: string): string {
    const match = url.match(/^https?:\/\/(?:www\.)?([^.\/]+)/i)
    // @ts-ignore
    return match ? match[1] : "empty";
}

async function combineDataFrames(
    websideInventories: DataFrame[] | null,
    outputCsvPath: string
) {
    if (!websideInventories || websideInventories.length === 0) {
        console.warn('No valid DataFrames to combine.');
        return;
    }

    let combinedDf: DataFrame | void = websideInventories[0];
    if (combinedDf) {
        for (let i = 1; i < websideInventories.length; i++) {
            combinedDf = combinedDf.union(websideInventories[i]!);
        }
        combinedDf.toCSV(true, outputCsvPath);
    }
    console.log(`Combined CSV saved to ${outputCsvPath}`);
}

async function main() {
    // load data
    const inventoryFilePath = './website_inventories.csv';
    const snapshotFilePath = '../snapshots/';

    // aggregate csvs
    try {
        const dataFramedWebsiteInventories = await downloadAndLoad(inventoryFilePath, snapshotFilePath);
        await combineDataFrames(
            dataFramedWebsiteInventories,
            snapshotFilePath + 'us-gov-public-website-inventory.csv'
        );
        console.log('Download and storage complete.');
    } catch (error) {
        console.error(error);
    }
}


main().catch(error => console.error(error));