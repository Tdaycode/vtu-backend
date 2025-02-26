import { Document, ObjectId } from 'mongoose';

export interface IProduct {
    name: string,
    imageUrl: string,
    label: string,
    sid?: string,
    serviceFee?: ServiceFee,
    description?: string,
    minPrice?: number,
    maxPrice?: number,
    currency: string,
    providers?: Provider[],
    discount?: Discount,
    paymentOptions?: PaymentOptions,
    category: ObjectId,
    isAvailable?: boolean,
    allowedPaymentOptions: PaymentTypes[],
    displayCountries: string[],
    type: ProductTypes
}

interface Discount {
    type: DiscountType,
    mode: DiscountAmountType,
    value: number,
    active: boolean
}; 

interface ServiceFee {
    type: ServiceFeeAmountType,
    value: number,
    active: boolean
} 

interface Provider {
    name: Providers,
    productId: string,
    serviceId: ServiceTypes
    active: boolean
} 

export enum PaymentTypes {
    Adyen = 'adyen',
    BinancePay = 'binance-pay',
    Flutterwave = 'flutterwave',
    Cowry = 'cowry',
    Wallet = 'wallet'
}

export enum Providers {
    PrimeAirtime = 'primeairtime',
    Giftly = 'giftly',
    ValueTopup = 'valuetopup',
    TeleBank = 'telebank',
    Interswitch = 'interswitch'
}

export enum PaymentOptions {
    Global = 'global',
    Specific = 'specific',
}

export enum ServiceFeeAmountType {
    Percentage = 'percentage',
    Flat = 'flat',
}

export enum DiscountAmountType {
    Percentage = 'percentage',
    Flat = 'flat',
}

export enum ProductTypes {
    Airtime = 'airtime',
    Data = 'data',
    Electricity = 'electricity',
    TV = 'dstv',
    Betting = 'Betting',
    Internet = 'internet',
    Misc = 'misc',
    GiftCard = 'giftcard',
    Cowry = 'cowry',
    Manual = 'manual'
}

export enum ProductIDs {
    // Airtime and Data
    INTERSWITCH_MTN = '10906',
    INTERSWITCH_GLO = '40201',
    PRIME_AIRTIME_SMILE_RECHARGE = 'BPI-NGCA-ANA',

    // TV
    PRIME_AIRTIME_DSTV = "BPD-NGCA-AQA",
    PRIME_AIRTIME_GOTV = "BPD-NGCA-AQC",
    PRIME_AIRTIME_STARTIMES = "BPD-NGCA-AWA",
    PRIME_AIRTIME_SHOWMAX = "BPD-NGPU-SHOWMAX",

    // BETTING
    PRIME_AIRTIME_BET9JA = "BET9JA",
    PRIME_AIRTIME_BANGBET = "BANGBET",
    PRIME_AIRTIME_NAIRABET = "NAIRABET",
    INTERSWITCH_NAIRABET = "55501",
    PRIME_AIRTIME_SUPABET = "SUPABET",
    PRIME_AIRTIME_1XBET = "1XBET",
    PRIME_AIRTIME_MERRYBET = "MERRYBET",
    PRIME_AIRTIME_BETLION = "BETLION",
    PRIME_AIRTIME_BETWAY = "BETWAY",
    PRIME_AIRTIME_LIVESCOREBET = "LIVESCOREBET",
    PRIME_AIRTIME_CLOUDBET = "CLOUDBET",
    PRIME_AIRTIME_NAIJABET = "NAIJABET",
    PRIME_AIRTIME_BETKING = "BETKING",
    PRIME_AIRTIME_BETLAND = "BETLAND",
    INTERSWITCH_Accessbet = "2871",
    INTERSWITCH_22BET = "3801",
    INTERSWITCH_BETBIGA = "3590",
    INTERSWITCH_BetBonanza = "3647",
    INTERSWITCH_BETFARM = "3515",
    INTERSWITCH_FortuneBet = "3005",
    INTERSWITCH_Kickoff102Bet = "2280",
    INTERSWITCH_MSport = "33892",
    INTERSWITCH_NETBET = "3713",
    INTERSWITCH_PLOTO = "3799",
    INTERSWITCH_SportyBet = "3472",
    INTERSWITCH_Surebet247 = "1019",
    INTERSWITCH_WGB = "1449",
    INTERSWITCH_ZEbet = "3812",

    // INTERNET
    PRIME_AIRTIME_SPECTRANET = "BPI-NGCA-BGA",
    PRIME_AIRTIME_SMILE_INTERNET = "BPI-NGCA-ANB",

    // ELECTRICITY
    PRIME_AIRTIME_EKO = "BPE-NGEK-OR",
    PRIME_AIRTIME_IKEJA = "BPE-NGIE-OR",
    PRIME_AIRTIME_IBEDC = "BPE-NGIB-OR",
    PRIME_AIRTIME_EEDC = "BPE-NGEN-OR",
    PRIME_AIRTIME_PHEDC_PREPAID = "BPE-NGCABIA-OR",
    PRIME_AIRTIME_PHEDC_POSTPAID = "BPE-NGCABIB-OR",
    PRIME_AIRTIME_KANO_PREPAID = "BPE-NGCAAVB-OR",
    PRIME_AIRTIME_KANO_POSTPAID = "BPE-NGCAAVC-OR", 
    PRIME_AIRTIME_ABUJA_PREPAID = "BPE-NGCABABA-OR", 
    PRIME_AIRTIME_ABUJA_POSTPAID = "BPE-NGCABABB-OR", 
    PRIME_AIRTIME_KADUNA = "BPE-NGKD-OR",
    PRIME_AIRTIME_JOS = "BPE-NGJO-OR",
    PRIME_AIRTIME_BENIN = "BPE-NGCABENIN-OR",

    INTERSWITCH_EKO_PREPAID = "246",
    INTERSWITCH_EKO_POSTPAID = "1316",
    INTERSWITCH_IKEJA_PREPAID = "765",
    INTERSWITCH_IKEJA_POSTPAID = "849",
    INTERSWITCH_IBEDC_PREPAID = "784",
    INTERSWITCH_IBEDC_POSTPAID = "792",
    INTERSWITCH_EEDC_PREPAID = "783",
    INTERSWITCH_EEDC_POSTPAID = "785",
    INTERSWITCH_PHEDC_PREPAID = "3712",
    INTERSWITCH_PHEDC_POSTPAID = "860",
    INTERSWITCH_KADUNA_PREPAID = "2969",
    INTERSWITCH_JOS_PREPAID = "2979",
    INTERSWITCH_JOS_POSTPAID = "2978",
    INTERSWITCH_BENIN_POSTPAID = "646",

    // GIFT CARD
    TELEBANK_COWRY = "cowry"
}

export enum ServiceTypes {
    Electricity = 'electricity',
    TV = 'dstv',
    Lottery = 'lottery',
    Internet = 'internet',
    Misc = 'misc',
    GiftCard = 'giftcard',
    Cowry = 'cowry',
}

export enum DiscountType {
    Global = 'global',
    Specific = 'specific',
}

export enum ElectricityType {
    POSTPAID = 'postpaid',
    PREPAID = 'prepaid',
}

export interface IProductDocument extends IProduct, Document {}

  