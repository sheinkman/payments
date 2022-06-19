import mongoose, {Schema} from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {IPaymentRequest, IPaymentResponse} from "../interfaces/IPayment";

export const PaymentSchema = new Schema({
    reference: String,
    amount: Number,
    amount_received: Number,
    country_from: String,
    sender_full_name: String,
    sender_address: String,
    school: String,
    currency_from: String,
    student_id: Number,
    email: String,
    amountWithFees: Number,
    overPayment: Boolean,
    underPayment: Boolean,
    qualityCheck: String
});

const PaymentModel = mongoose.model('Payment', PaymentSchema);

let mongod: MongoMemoryServer;

export const initDb = async () => {
    mongod = await MongoMemoryServer.create();

    await mongoose.connect(mongod.getUri(), { dbName: process.env.DB_NAME }, err => {
        if (err) {
            console.error(err);
        }
    });
}


export const closeDb = async () => {
    await mongoose.disconnect();
    await mongod.stop();
}


export const getPaymentByReference = async (reference: string): Promise<IPaymentResponse|null> => {
    const resp = await PaymentModel.findOne({reference: reference}).exec();

    if(resp){
        const newPayment:IPaymentResponse = {
            reference: <string>resp.reference,
            amount: Number(resp.amount),
            amountWithFees: Number(resp.amountWithFees),
            amountReceived: Number(resp.amount_received),
            qualityCheck: <string>resp.qualityCheck,
            overPayment: !!resp.overPayment,
            underPayment: !!resp.underPayment,
        }
        return newPayment;
    }
    return null;
}

export const savePaymentByReference = async (payment: IPaymentRequest, qualityCheck: string, amountWithFees: number) => {

    const newPayment:IPaymentResponse = {
        reference: payment.reference,
        amount: payment.amount,
        amountWithFees: amountWithFees,
        amountReceived: payment.amount_received,
        qualityCheck: qualityCheck,
        overPayment: amountWithFees < payment.amount,
        underPayment: amountWithFees > payment.amount
    };

    const newPaymentSchema = new PaymentModel({
       ...payment,
        amountWithFees: newPayment.amountWithFees,
        qualityCheck: newPayment.qualityCheck,
        overPayment: newPayment.overPayment,
        underPayment: newPayment.underPayment
    })

    await newPaymentSchema.save(function(err,result){
        if (err){
            console.log(err);
            throw err;
        }
    })
    return newPayment;
}
