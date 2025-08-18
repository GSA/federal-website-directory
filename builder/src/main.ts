import {DataFrame} from 'dataframe-js';
import csvParser from 'csv-parser';
import * as fs from 'fs';

interface WebsiteInventory {
    agency: string;
    website_inventory: string;
}

async function downloadAndLoad(inventoryPath: string, snapshotPath: string): Promise<[DataFrame] | void> {
    return new Promise((resolve, reject) => {
        const results: WebsiteInventory[] = [];
        const inventoryStream = fs.createReadStream(inventoryPath, {encoding: 'utf8'});
        inventoryStream
            .pipe(csvParser())
            .on('data', async (row: WebsiteInventory) => {
                if (row.website_inventory) results.push(row);
            })
            .on('end', async () => {
                try {
                    const promises = results.map(async (inventory) => {
                        const domain = retrieveDomainFromUrl(inventory.website_inventory);
                        const savePath = snapshotPath + domain + '.csv';

                        console.log(`Downloading ${inventory.website_inventory} to ${savePath}`);
                        const currentData = await DataFrame.fromCSV(inventory.website_inventory, true);
                        console.log("\nCurrent data:" + currentData);
                        currentData.toCSV(true, savePath);
                        return currentData
                    });

                    const websiteInventoryDataFrames = await Promise.all(promises);
                    console.log('Finished parsing website inventory data.');
                    // @ts-ignore
                    resolve(websiteInventoryDataFrames);
                } catch (err) {
                    console.warn('There was an issue loading the CSV from ${agency}: ${error.message}. Skipping...');
                    resolve()
                }
            })
            .on('error', () => {
                console.warn('There was an issue loading the CSV from ${agency}: ${error.message}. Skipping...');
            })
    });
}

function retrieveDomainFromUrl(url: string): string {
    const match = url.match(/^https?:\/\/(?:www\.)?([^.\/]+)/i)
    // @ts-ignore
    return match ? match[1] : "empty";
}

async function combineDataFrames(
    websideInventories: [DataFrame] | void,
    outputCsvPath: string
) {
    if (!websideInventories) {
        console.warn('No DataFrames to combine.');
        return;
    }

    // const referenceDf = "Website,Agency,Bureau,Subcomponent"
    const referenceHeaders = ["Website","Agency","Bureau","Subcomponent"]
    const headers = referenceHeaders.join(', ')
    // const referenceHeaders: string[] = referenceDf.listColumns().slice(0, 4); // first 4 columns
    const cleanedInventories: DataFrame[] = [];

    for (const inventory of websideInventories) {
        if (inventory.listColumns().length < 4) {
            console.warn(`Skipping: less than 4 columns`);
            continue;
        }

        const selectedInventories = inventory.select("Website", "Agency", "Bureau", "Subcomponent");

        // Rename columns to match reference headers
        selectedInventories.renameAll(referenceHeaders);

        cleanedInventories.push(selectedInventories);
    }

    if (cleanedInventories.length === 0) {
        console.warn('No valid DataFrames after cleaning.');
        return;
    }

    // @ts-ignore
    let combinedDf: DataFrame = cleanedInventories[0];
    for (let i = 1; i < cleanedInventories.length; i++) {
        // @ts-ignore
        combinedDf = combinedDf.union(cleanedInventories[i]);
    }

    combinedDf.toCSV(true, outputCsvPath);
    console.log(`Combined CSV saved to ${outputCsvPath}`);
}

async function main() {
    // load data
    const inventoryFilePath = './test_website_inventories.csv';
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