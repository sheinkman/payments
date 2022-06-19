import {PaymentsService} from "../src/services/payments.service";
import {getPaymentByReference, savePaymentByReference} from "../src/database/db";
import {IPaymentResponse} from "../src/interfaces/IPayment";

const request = {
    "bookings":[
        {
            "reference": "reference",
            "amount": 1000,
            "amount_received": 1030,
            "country_from": "US",
            "sender_full_name": "Uri sheinkman",
            "sender_address": "sender_address",
            "school": "school",
            "currency_from": "EUR",
            "student_id": 1,
            "email": "uri@uri.uri",
            "qualityCheck": '',
            "amountWithFees": 1050,
            "overPayment": false,
            "underPayment": true
        }
    ]
};

const requestAmountThresholdAndInvalidEmail = {
    "bookings":[
        {
            "reference": "reference",
            "amount": 1000000,
            "amount_received": 1030,
            "country_from": "US",
            "sender_full_name": "Uri sheinkman",
            "sender_address": "sender_address",
            "school": "school",
            "currency_from": "EUR",
            "student_id": 1,
            "email": "uri@uri",
            "qualityCheck": '',
            "amountWithFees": 1050,
            "overPayment": false,
            "underPayment": true
        }
    ]
};

const requestWrongEmail = {
    "bookings":[
        {
            "reference": "reference",
            "amount": 1000,
            "amount_received": 1030,
            "country_from": "US",
            "sender_full_name": "Uri sheinkman",
            "sender_address": "sender_address",
            "school": "school",
            "currency_from": "EUR",
            "student_id": 1,
            "email": "uri@uri",
            "qualityCheck": '',
            "amountWithFees": 1050,
            "overPayment": false,
            "underPayment": true
        }
    ]
};

const getExistingResponse = {
    reference: 'reference',
    amount: 1000,
    amountWithFees: 1050,
    amountReceived: 1030,
    qualityCheck: '',
    overPayment: false,
    underPayment: true
};


const savedNewPayment = {
        reference: 'reference',
        amount: 1000,
        amount_received: 1030,
        country_from: 'US',
        sender_full_name: 'Uri sheinkman',
        sender_address: 'sender_address',
        school: 'school',
        currency_from: 'EUR',
        student_id: 1,
        email: 'uri@uri.uri',
        qualityCheck: '',
        amountWithFees: 1050,
        overPayment: false,
        underPayment: true
    }
;


jest.mock('../src/database/db');


const mockGetPaymentByReference = getPaymentByReference as jest.MockedFunction<typeof getPaymentByReference>;
mockGetPaymentByReference
    .mockImplementationOnce(async () => null)
    .mockImplementationOnce(async () => getExistingResponse)
    .mockImplementationOnce(async () => null);

const mockSavePaymentByReference = savePaymentByReference as jest.MockedFunction<typeof savePaymentByReference>;
mockSavePaymentByReference.mockResolvedValue(savedNewPayment)

const mockPaymentsService = new PaymentsService();

describe('payment service', () => {
    it('handlePayment new reference overPayment false underPayment true', async () => {
        const res:IPaymentResponse[] = await mockPaymentsService.handlePayment(request.bookings);
        expect(Array.isArray(res)).toBe(true);
        expect(res[0].qualityCheck).toEqual("");
        expect(res[0].qualityCheck).not.toContain("AmountThreshold");
        expect(res[0].qualityCheck).not.toContain("InvalidEmail");
        expect(res[0].qualityCheck).not.toContain("DuplicatedPayment");
    });

    it('handlePayment existing reference overPayment false underPayment true', async () => {
        const res = await mockPaymentsService.handlePayment(request.bookings);
        expect(Array.isArray(res)).toBe(true);
        expect(res[0].qualityCheck).toEqual("DuplicatedPayment");
    });

    it('handlePayment new reference wrong email overPayment false underPayment true', async () => {
        const res:IPaymentResponse[] = await mockPaymentsService.handlePayment(requestWrongEmail.bookings);
        console.log('resresresresresres:', res);
        expect(Array.isArray(res)).toBe(true);
        expect(res[0].qualityCheck).toEqual("InvalidEmail");
    });

    it('handlePayment new reference AmountThreshold and InvalidEmail overPayment false underPayment true', async () => {
        const res:IPaymentResponse[] = await mockPaymentsService.handlePayment(requestAmountThresholdAndInvalidEmail.bookings);
        expect(Array.isArray(res)).toBe(true);
        expect(res[0].qualityCheck).toContain("AmountThreshold");
        expect(res[0].qualityCheck).toContain("InvalidEmail");
    });
});

