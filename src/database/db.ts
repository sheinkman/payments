import {IBasic} from "../interfaces/IModels";

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const query = <T>(command:string, method = 'all') => {
    return new Promise((resolve, reject) => {
        db[method](command, (error: any, result: T) => {
            if (error) {
                reject(error);
            } else {
                resolve(<T>result);
            }
        });
    });
};


export const initDb = async () => {
    db.serialize(async () => {
        await query("CREATE TABLE IF NOT EXISTS payments (reference text, amount number, amount_received number, country_from text, sender_full_name text, sender_address text, school text, currency_from text, student_id number, email text, amountWithFees number, overPayment boolean, underPayment boolean, qualityCheck text)", 'run');
    });
}


export const closeDb = async () => {

}


export const getPaymentByReference = async (reference: string): Promise<IBasic|null> => {
    const resp: any = await query<IBasic>(`SELECT * FROM payments where reference = '${reference}'`);

    if(resp && resp.length > 0){
        const newModel:IBasic = {
            id: 1,
            sex: '1',
            age: 1,
            height: 1,
            weight: 1
        }
        return newModel;
    }
    return null;
}

export const save = async (model: IBasic): Promise<IBasic> => {


    await query(`INSERT INTO payments VALUES ("${model.id}",)`, 'run');

    console.log(`save model: ${typeof model}`, model);

    return model;
}
