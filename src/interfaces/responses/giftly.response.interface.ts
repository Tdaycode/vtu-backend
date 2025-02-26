export interface GiftlyAccessTokenResponse {
    access: string
    expire: number
}

export interface GiftlyCatalogAvailabilityResponse {
    availability: boolean
    detail: string
}

export interface GiftlyCreateOrderResponse {
    order_id: number
    delivery_type: number
    status: number
    status_text: string
    created_time: string
    terminal_id: number
    reference_code: string
    product: Product
    count: number
    total_face_value: number
    total_fees: number
    total_discounts: number
    total_customer_cost: number
    is_completed: boolean
    share_link: string
}

export interface GiftlyOrderCardsResponse {
    results: OrderCardsResult[]
}

export interface OrderCardsResult {
    card_number: string
    pin_code: string
    claim_url: string
    expire_date: string
}

export interface Product {
    sku: number
    title: string
}


export interface GiftlyCatalogResponse {
    count: number
    results: Result[]
}

export interface Result {
    sku: number
    upc: number
    title: string
    min_price: number
    max_price: number
    pre_order: boolean
    activation_fee: number
    showing_price: any
    percentage_of_buying_price: number
    currency: Currency
    categories: Category[]
    regions: Region[]
    image: string
    description: string
}

export interface Currency {
    currency: string
    symbol: string
    code: string
}

export interface Category {
    name: string
}

export interface Region {
    name: string
    code: string
}
