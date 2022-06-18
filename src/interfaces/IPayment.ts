export interface IPaymentRequest {
    reference: string,
    amount: number,
    amount_received: number,
    country_from: string,
    sender_full_name: string,
    sender_address: string,
    school: string,
    currency_from: string,
    student_id: number,
    email: string,
}

export interface IPaymentResponse {
    reference: string,
    amount: number,
    amountWithFees: number,
    amountReceived: number,
    qualityCheck: string,
    overPayment: boolean,
    underPayment: boolean
}
