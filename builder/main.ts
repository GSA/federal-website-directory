import DataFrame from 'dataframe-js';
import csv = require('csv-parser');
import * as fs from 'fs';

interface WebsiteInventory {
    name: string;
    file_url: string;
}

async function downloadAndLoad(inventoryPath: string, snapshotPath: string): Promise<[DataFrame]> {
    return new Promise((resolve, reject) => {
        const results: WebsiteInventory[] = [];
        const inventoryStream = fs.createReadStream(inventoryPath, {encoding: 'utf8'});
        inventoryStream.pipe(csv())
            .on('data', async (row: WebsiteInventory) => {
                if (row.file_url) results.push(row);
            })
            .on('end', async () => {
                try {
                    const promises = results.map(async (inventory) => {
                        const domain = retrieveDomainFromUrl(inventory.file_url);
                        const savePath = snapshotPath + domain + '.csv';

                        const currentData = await DataFrame.fromCSV(inventory.file_url, true);
                        currentData.toCSV(true, savePath);
                        return currentData
                    });

                    const websiteInventoryDataFrames = await Promise.all(promises);
                    console.log('Finished parsing website inventory data.');
                    return websiteInventoryDataFrames;
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', () => {
                console.warn('There was an issue loading the CSV from ${agency}: ${error.message}. Skipping...');
            })
    });
}

function retrieveDomainFromUrl(url: string): string {
    const match = url.match(/^https?:\/\/(?:www\.)?([^\/]+)/i)
    return match ? match[1] : null;
}

async function combineDataFrames(
    websideInventories: DataFrame[],
    outputCsvPath: string
) {
    if (websideInventories.length === 0) {
        console.warn('No DataFrames to combine.');
        return;
    }

    const referenceDf = websideInventories[0]
    const referenceHeaders: string[] = referenceDf.listColumns().slice(0, 4); // first 4 columns
    const cleanedInventories: DataFrame[] = [];

    for (const inventory of websideInventories) {
        if (inventory.listColumns().length < 4) {
            console.warn(`Skipping: less than 4 columns`);
            continue;
        }

        const selectedInventories = inventory.select(referenceHeaders.join(','));

        // Rename columns to match reference headers
        selectedInventories.renameAll(referenceHeaders);

        cleanedInventories.push(selectedInventories);
    }

    if (cleanedInventories.length === 0) {
        console.warn('No valid DataFrames after cleaning.');
        return;
    }

    let combinedDf = cleanedInventories[0];
    for (let i = 1; i < cleanedInventories.length; i++) {
        combinedDf = combinedDf.union(cleanedInventories[i]);
    }

    combinedDf.toCSV(true, outputCsvPath);
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
            '../snapshots/us-gov-public-website-inventory.csv'
        );
        console.log('Download and storage complete.');
    } catch (err) {
        console.error(err);
    }
}


main().catch(err => console.error(err));