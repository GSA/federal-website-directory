import DataFrame from 'dataframe-js';
import csvParser from 'csv-parser';
import * as fs from 'fs';
async function downloadAndLoad(inventoryPath, snapshotPath) {
    return new Promise((resolve, reject) => {
        const results = [];
        const inventoryStream = fs.createReadStream(inventoryPath, { encoding: 'utf8' });
        inventoryStream
            .pipe(csvParser())
            .on('data', async (row) => {
            if (row.file_url)
                results.push(row);
        })
            .on('end', async () => {
            try {
                const promises = results.map(async (inventory) => {
                    const domain = retrieveDomainFromUrl(inventory.file_url);
                    const savePath = snapshotPath + domain + '.csv';
                    const currentData = await DataFrame.fromCSV(inventory.file_url, true);
                    console.log("\nCurrent data:" + currentData);
                    currentData.toCSV(true, savePath);
                    return currentData;
                });
                const websiteInventoryDataFrames = await Promise.all(promises);
                console.log('Finished parsing website inventory data.');
                return websiteInventoryDataFrames;
            }
            catch (err) {
                reject(err);
            }
        })
            .on('error', () => {
            console.warn('There was an issue loading the CSV from ${agency}: ${error.message}. Skipping...');
        });
    });
}
function retrieveDomainFromUrl(url) {
    const match = url.match(/^https?:\/\/(?:www\.)?([^\/]+)/i);
    // @ts-ignore
    return match ? match[1] : "empty";
}
async function combineDataFrames(websideInventories, outputCsvPath) {
    if (websideInventories.length === 0) {
        console.warn('No DataFrames to combine.');
        return;
    }
    // const referenceDf = "Website,Agency,Bureau,Subcomponent"
    const referenceHeaders = ["Website", "Agency", "Bureau", "Subcomponent"];
    const headers = referenceHeaders.join(',');
    // const referenceHeaders: string[] = referenceDf.listColumns().slice(0, 4); // first 4 columns
    const cleanedInventories = [];
    for (const inventory of websideInventories) {
        if (inventory.listColumns().length < 4) {
            console.warn(`Skipping: less than 4 columns`);
            continue;
        }
        const selectedInventories = inventory.select(headers);
        // Rename columns to match reference headers
        selectedInventories.renameAll(referenceHeaders);
        cleanedInventories.push(selectedInventories);
    }
    if (cleanedInventories.length === 0) {
        console.warn('No valid DataFrames after cleaning.');
        return;
    }
    // @ts-ignore
    let combinedDf = cleanedInventories[0];
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
        await combineDataFrames(dataFramedWebsiteInventories, '../snapshots/us-gov-public-website-inventory.csv');
        console.log('Download and storage complete.');
    }
    catch (err) {
        console.error(err);
    }
}
main().catch(err => console.error(err));
//# sourceMappingURL=main.js.map