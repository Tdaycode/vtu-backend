export interface ExchangeRateResponse {
    disclaimer: string
    license: string
    timestamp: number
    base: string
    rates: Rates
}

export interface Rates {
    [key: string]: number
}

export interface BinanceRateResponse {
    symbol: string
    bidPrice: string
    bidQty: string
    askPrice: string
    askQty: string
}

export interface QuidaxRateResponse {
    status: string
    message: string
    data: Data
}

export interface Data {
    at: number
    ticker: Ticker
    market: string
}

export interface Ticker {
    buy: string
    sell: string
    low: string
    high: string
    open: string
    last: string
    vol: string
}


export interface LunoRateResponse {
    pair: string
    timestamp: number
    bid: string
    ask: string
    last_trade: string
    rolling_24_hour_volume: string
    status: string
}
