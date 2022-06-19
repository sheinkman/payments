import {IPaymentRequest, IPaymentResponse} from "../interfaces/IPayment";

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


export const getPaymentByReference = async (reference: string): Promise<IPaymentResponse|null> => {
    const resp: any = await query<IPaymentResponse>(`SELECT * FROM payments where reference = '${reference}'`);

    if(resp && resp.length > 0){
        const newPayment:IPaymentResponse = {
            reference: <string>resp[0].reference,
            amount: Number(resp[0].amount),
            amountWithFees: resp[0].amountWithFees,
            amountReceived: resp[0].amount_received,
            qualityCheck: <string>resp[0].qualityCheck,
            overPayment: !!resp[0].overPayment,
            underPayment: !!resp[0].underPayment,
        }
        return newPayment;
    }
    return null;
}

export const savePaymentByReference = async (payment: IPaymentRequest): Promise<IPaymentRequest> => {


    await query(`INSERT INTO payments VALUES ("${payment.reference}",
                                            "${payment.amount}",
                                            "${payment.amount_received}",
                                            "${payment.country_from}",
                                            "${payment.sender_full_name}",
                                            "${payment.sender_address}",
                                            "${payment.school}",
                                            "${payment.currency_from}",
                                            "${payment.student_id}",
                                            "${payment.email}",
                                            "${payment.amountWithFees}",
                                            "${payment.overPayment}",
                                            "${payment.underPayment}",
                                            "${payment.qualityCheck}")`, 'run');

    console.log("newPaymentnewPaymentnewPaymentnewPayment:", payment);

    return payment;
}
