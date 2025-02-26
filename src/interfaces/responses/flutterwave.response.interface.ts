export interface FlutterwavePaymentResponse {
    status: string
    message: string
    data: Data
}

export interface Data {
    link: string
}

export interface FlutterwaveVerifyTransactionResponse {
    status: string
    message: string
    data: VerifyData
}

export interface VerifyData {
    id: number
    tx_ref: string
    flw_ref: string
    device_fingerprint: string
    amount: number
    currency: string
    charged_amount: number
    app_fee: number
    merchant_fee: number
    processor_response: string
    auth_model: string
    ip: string
    narration: string
    status: string
    payment_type: string
    created_at: string
    account_id: number
    amount_settled: number
    card: Card
    customer: Customer
}

export interface Card {
    first_6digits: string
    last_4digits: string
    issuer: string
    country: string
    type: string
    token: string
    expiry: string
}

export interface Customer {
    id: number
    name: string
    phone_number: string
    email: string
    created_at: string
}
