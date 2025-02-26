export interface InterswitchAccessTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  metadata: Metadata
  merchant_code: string
  requestor_id: string
  terminalId: string
  env: string
  payable_id: string
  client_description: any
  institution_id: string
  core_id: string
  api_resources: string[]
  client_name: string
  client_logo: any
  payment_code: string
  client_code: string
  jti: string
}

export interface Metadata {
  institutionCode: string
}

export interface InterswitchCustomerValidationResponse {
  Customers: Customer[]
  ResponseCode: string
  ResponseCodeGrouping: string
}

export interface Customer {
  BillerId: number
  PaymentCode: string
  CustomerId: string
  ResponseCode: string
  ResponseDescription: string
  FullName: string
  Amount: number
  AmountType: number
  AmountTypeDescription: string
  Surcharge: number
}

export interface InterswitchTransactionResponse {
  TransactionRef: string
  ApprovedAmount: string
  AdditionalInfo: AdditionalInfo
  ResponseCode: string
  ResponseDescription: string
  ResponseCodeGrouping: string
}

export interface InterswitchGetPaymentItemResponse {
  PaymentItems: PaymentItem[]
  ResponseCode: string
  ResponseCodeGrouping: string
}

export interface PaymentItem {
  Id: string
  Name: string
  BillerName: string
  ConsumerIdField: string
  Code: string
  BillerType: string
  ItemFee: string
  Amount: string
  BillerId: string
  BillerCategoryId: string
  CurrencyCode: string
  CurrencySymbol: string
  ItemCurrencyCode: string
  ItemCurrencySymbol: string
  Children: any[]
  IsAmountFixed: boolean
  SortOrder: number
  PictureId: number
  PictureGuid: string
  PaymentCode: string
  AmountType: number
  PaydirectItemCode: string
}

export interface AdditionalInfo {}


