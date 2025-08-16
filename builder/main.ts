import DataFrame from 'dataframe-js';
import csv from 'csv-parser';
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

async function main() {
    // load data
    const inventoryFilePath = './website_inventories.csv';
    const snapshotFilePath = '../snapshots/';

    await (async () => {
        try {
            const dataFramedWebsiteInventories = await downloadAndLoad(inventoryFilePath, snapshotFilePath);
            console.log('Download and storage complete.');
        } catch (err) {
            console.error(err);
        }
    })();

    // sort csv

    // save csv to required dir
    
    // money

    return "Hi I'm main"
}

main()