import * as EmailValidator from 'email-validator';
import {IPaymentRequest, IPaymentResponse} from "../interfaces/IPayment";
import {getPaymentByReference, savePaymentByReference} from "../database/db";

const CC = require('currency-converter-lt');

export class PaymentsService {
    async getPaymentByReference(reference: string): Promise<IPaymentResponse|null>{
        const resp = await getPaymentByReference(reference);
        if(!!resp){
            const qualityCheck = resp.qualityCheck.split(', ').filter((str)=>{ return str&&str.length>0});
            qualityCheck.push('DuplicatedPayment');
            resp.qualityCheck = qualityCheck.join(', ');
        }
        return resp;
    }

    async savePaymentByReference(payment: IPaymentRequest, qualityCheck: string): Promise<IPaymentResponse>{
        const amountWithFees = this.calcFees(payment.amount);
        payment.qualityCheck = qualityCheck;
        payment.amountWithFees = amountWithFees;
        payment.overPayment = amountWithFees < payment.amount;
        payment.underPayment = amountWithFees > payment.amount;


        const savedPayment = await savePaymentByReference(payment);
        const resp:IPaymentResponse = {
            amount: savedPayment.amount,
            amountReceived: payment.amount_received,
            amountWithFees: Number(payment.amountWithFees),
            overPayment: payment.overPayment,
            qualityCheck: payment.qualityCheck??'',
            reference: payment.reference,
            underPayment: payment.underPayment

        };

        return resp;
    }

    async getConversionRate(currency: string) {
        // mock not real converter
        const currencyConverter = new CC({from:currency, to:"USD", amount:1, isDecimalComma:true});
        const rate = await currencyConverter.from(currency.toUpperCase()).to("USD").amount(1).convert();
        return rate;
    }

    calcFees = (amount: number): number => {
        if(amount <= 1000){
            return amount * 1.05;
        }
        if(amount > 1000 && amount <= 10000){
            return amount * 1.03;
        }
        return amount * 1.02;
    }

     getUsdAmount = async (amount: number, currency: string) => {
        if(currency.toLowerCase() !== 'usd'){
            return amount * await this.getConversionRate(currency);
        }
        return amount;
    }


    doQualityCheck = async (payment: IPaymentRequest) => {
        const qualityCheck: string[] = [];

        if(await this.getUsdAmount(payment.amount, payment.currency_from)> 1000000){
            qualityCheck.push('AmountThreshold');
        }
        if(!EmailValidator.validate(payment.email)){
            qualityCheck.push('InvalidEmail');
        }
        return qualityCheck.join(', ');
    }

    async handlePayment(payments: IPaymentRequest[]): Promise<IPaymentResponse[]> {
        const resps = await Promise.all(payments.map(async (payment) => {
            let resp = await this.getPaymentByReference(payment.reference);
            if(!resp){
                const qualityCheck = await this.doQualityCheck(payment);
                resp = await this.savePaymentByReference(payment, qualityCheck);
            }
            return resp;
        }));

        return resps;
    }
}
