import DataFrame from 'dataframe-js';
import csv from 'csv-parser';
import * as fs from 'fs';


function load(inventoryPath: string, snapshotPath: string): Promise<DataFrame> {
    const inventoryStream = fs.createReadStream(inventoryPath, { encoding: 'utf8' });
    let currentData
    inventoryStream.pipe(csv())
        .on('data', async (inventory) => {
            const agency = inventory['agency'];
            const fileUrl = inventory['website_inventory'];

            currentData = await DataFrame.fromCSV(fileUrl, true);
            currentData.toCSV(true, snapshotPath)
        })
        .on('end', () => {
            console.log('Finished parsing website inventory data.');
        })
        .on('error', () => {
        console.warn('There was an issue loading the CSV from ${agency}: ${error.message}');
        })
    return currentData    
}

async function main() {
    // load data
    const inventoryFilePath = './website_inventories.csv'
    const snapshotFilePath = '../snapshots/'
    const inventoryStream = fs.createReadStream(inventoryFilePath, { encoding: 'utf8' });
    inventoryStream.pipe(csv())
        .on('data', (inventory) => {
            const agency = inventory['agency'];
            const fileUrl = inventory['website_inventory'];

            let currentData = DataFrame.fromCSV(fileUrl, true);
            currentData.toCSV(true, snapshotFilePath)
        })
        .on('end', () => {
            console.log('Finished parsing website inventory data.');
        })
        .on('error', () => {
           console.warn('There was an issue loading the CSV from ${agency}: ${error.message}');
           ; 
        })


    // sort csv

    // save csv to required dir
    
    // money

    return "Hi I'm main"
}

main()