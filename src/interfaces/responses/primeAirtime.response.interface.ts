export interface PrimeAirtimeAccessTokenResponse {
    token: string
    expires: string
}

export interface PrimeAirtimeTopUpInfoResponse {
    opts: Opts
    products: Product[]
}

export interface Opts {
    hasOpenRange: boolean
    country: string
    operator: string
    iso: string
    canOverride: boolean
    msisdn: string
}

export interface Product {
    product_id: string
    openRange: boolean
    topup_currency: string
    currency: string
    rate: number
    validity: string
    face_value: number
    topup_value: number
    price: number
    denomination: number
    data_amount: string
    openRangeMin: number
    openRangeMax: number
}

export interface PrimeAirtimeExecuteTopUpResponse {
    status: number
    message: string
    reference: string
    code: string
    paid_amount: number
    paid_currency: string
    topup_amount: number
    topup_currency: string
    target: string
    product_id: string
    time: string
    country: string
    operator_name: string
    completed_in: number
    api_transactionid: string
    pin_based: boolean,
    pin_code?: string,
    pin_option1: string
}

export interface PrimeAirtimeBettingValidationResponse {
    name: string
    customerId: string
    minPayableAmount: Number
}

export interface PrimeAirtimeElectricityValidationResponse {
    name: string
    address: string
    number: string
    minAmount?: number
    vendType?: string
    outstanding?: number
    debtRepayment?: number
}

export interface PrimeAirtimeTVValidationResponse {
    first_name: string
    last_name: string
    number: string
    status: string
    total_amount: string
    total_due_date: string
    total_balance_due: string
    primary_product_id: string
    primary_product_name: string
    primary_product_price: string
    primary_product_currency: string
    upgrades: Upgrade[]
    currency: string
}
  
export interface Upgrade {
    product_id: string
    product_key: string
    description: string
    topup_value: string
    topup_currency: string
    price: string
    currency: string
}

export interface PrimeAirtimeProductResponse {
    count: number
    products: Products[]
  }
  
  export interface Products {
    product_id: string
    openRange: boolean
    min_denomination: string
    max_denomination: string
    rate: string
    currency: string
    topup_currency: string
    name: string
    step: number
    multichoice: boolean
    hasValidate: boolean
    hasAddons: boolean
    hasProductList: boolean
  }