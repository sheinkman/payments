const fetch = require('node-fetch');
const csv = require('csvtojson');

const globalList = new Map();

export class MainService {
    async get(id: number) {
        const resp = globalList.get(id);
        if(resp){
            return resp;
        }
        throw new Error('not such index');
    }

    pivot(csvRow:Array<number[] | string[]>, index: number){
        const headerLestCsvRows = csvRow.splice(1,csvRow.length-1);
        const lineArray = headerLestCsvRows.map((row)=> {
            return row[index];
        });
        const result = lineArray.filter((element): element is string => {
            return element !== null;
        });
        return result;
    }

    setMap(csvRow:Array<number[] | string[]>, columnName: string){
        const headers = csvRow[0] as string[];
        const index = headers.indexOf(columnName);
        const size = globalList.size;
        const pivoted = this.pivot(csvRow, index);
        const sortedPivot = pivoted.sort();

        globalList.set(size, sortedPivot);
    }

    async parse(csvFile: string): Promise<Array<number[] | string[]>>{
        const csvAsList =  await csv({
            noheader:true,
            output: "csv"
        })
        .fromString(csvFile)
        .then((csvRow:Array<number[] | string[]>)=>{
            return csvRow;
        });
        return csvAsList
    }

    async saveList(url: string, columnName: string) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const csvFile = await response.text();
        const csvAsList = await this.parse(csvFile);
        this.setMap(csvAsList, columnName);

        return true;
    }

}
