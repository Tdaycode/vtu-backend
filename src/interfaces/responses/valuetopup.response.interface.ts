export interface IValueTopupResponse {
  responseCode: string
  responseMessage: string
}

export interface IGetValueTopupCatalog extends IValueTopupResponse {
  payLoad: ICatalog[]
}

export interface ICatalog {
  skuId: number
  productId: number
  productName: string
  min: Min
  max: Max
  category: string
  isSalesTaxCharged: boolean
  salesTax: number
  countryCode: string
  benefitType?: string
  validity?: string
  productDescription?: string
  localPhoneNumberLength: number
  internationalCountryCode: string[]
  allowDecimal: boolean
  fee: number
  operatorId: number
  operatorName: string
  imageUrl: string
}

export interface Min {
  faceValue: number
  faceValueCurrency?: string
  deliveredAmount: number
  deliveryCurrencyCode: string
  cost: number
  costCurrency: string
}

export interface Max {
  faceValue: number
  faceValueCurrency?: string
  deliveredAmount: number
  deliveryCurrencyCode: string
  cost: number
  costCurrency: string
}

export interface IGetValueTopupMobileLookup extends IValueTopupResponse {
  payLoad: PayLoad[]
}

export interface PayLoad {
  productId: number
  productName: string
  category: string
  countryCode: string
  operator: string
  operatorId: number
  denominationType: string
  skus: Sku[]
}

export interface Sku {
  skuId: number
  productId: number
  productName: string
  productDescription: string
  benefitType: string
  validity: string
  faceValue: number
  minAmount: number
  maxAmount: number
  discount: number
  pricing: string
  category: string
  isSalesTaxCharged: boolean
  salesTax: number
  exchangeRate: number
  currencyCode: string
  countryCode: string
  localPhoneNumberLength: number
  internationalCountryCode: string[]
  allowDecimal: boolean
  fee: number
  operatorName: string
  deliveryCurrencyCode: string
  supportedTransactionCurrencies: string
  carrierName: string
}


export interface IValueTopupPurchasePayLoadAPI extends IValueTopupResponse {
  payLoad: ValueTopupPurchasePayLoad
}

export interface ValueTopupPurchasePayLoad {
  transactionId: number
  transactionDate: string
  invoiceAmount: number
  faceValue: number
  discount: number
  fee: number
  product: Product
  topupDetail: TopupDetail
  pins: Pin[]
  giftCardDetail: GiftCardDetail
  simInfo: SimInfo
  billPaymentDetail: BillPaymentDetail
}

export interface Product {
  skuId: number
  productName: string
  faceValue: number
  instructions: string
}

export interface TopupDetail {
  localCurrencyAmount: number
  salesTaxAmount: number
  localCurrencyAmountExcludingTax: number
  destinationCurrency: string
  operatorTransactionId: string
}

export interface Pin {
  pinNumber: string
  controlNumber: string
  deliveredAmount: number
  deliveredCurrencyCode: string
  expirationDate: string
}

export interface GiftCardDetail {
  cardNumber: string
  pin: string
  certificateLink: string
}

export interface SimInfo {
  simNumber: string
  language: string
  zipCode: string
  mobileNumber: string
}

export interface BillPaymentDetail {
  accountNumber: string
  token: string
  unit: string
  receivedNarration: string
}
