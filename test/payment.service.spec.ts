//import {PaymentSchema} from "../src/database/db";
import {PaymentsService} from "../src/services/payments.service";

const request = {
    "bookings":[
        {
            "reference": "reference6",
            "amount": 1000,
            "amount_received": 1030,
            "country_from": "US",
            "sender_full_name": "Uri sheinkman",
            "sender_address": "sender_address",
            "school": "school",
            "currency_from": "EUR",
            "student_id": 1,
            "email": "uri@uri.uri"
        }
    ]
};


/*
jest.mock('../src/database/db', () => {
    return jest.fn().mockImplementation(() => ({
        getPaymentByReference: jest.fn(async (record: any): Promise<typeof PaymentSchema> => {
           return {

           };
        }),
        savePaymentByReference: jest.fn(),
    }));
});
*/
const mockPaymentsService = new PaymentsService();

describe('payment service', () => {
    it('handlePayment test', async () => {
        const res = await mockPaymentsService.handlePayment(request.bookings);
    });


});

