export interface BinancePayResponse {
  status: string
  code: string
  data: Data
  errorMessage: string
}

export interface Data {
  prepayId: string
  terminalType: string
  expireTime: number
  qrcodeLink: string
  qrContent: string
  checkoutUrl: string
  deeplink: string
  universalUrl: string
  totalFee: string
  currency: string
}

export interface Root {
  status: string
  code: string
  data: Data
  errorMessage: string
}

export interface BinancePayStatusResponse {
  status: string
  code: string
  data: BinancePayStatusData
  errorMessage: string
}

export interface BinancePayStatusData {
  merchantId: number
  prepayId: string
  transactionId: string
  merchantTradeNo: string
  status: string
  currency: string
  orderAmount: string
  openUserId: string
  passThroughInfo: string
  transactTime: number
  createTime: number
  paymentInfo: PaymentInfo
}

export interface PaymentInfo {
  payerId: string
  payMethod: string
  paymentInstructions: PaymentInstruction[]
  channel: string
}

export interface PaymentInstruction {
  currency: string
  amount: string
  price: string
}

export interface BinancePayWebhookPayload {
  bizType: string
  data: string
  bizIdStr: string
  bizId: number
  bizStatus: BinancePaymentStatus
}

export enum BinancePaymentStatus {
  PAY_SUCCESS = "PAY_SUCCESS",
  PAY_FAIL = "PAY_FAIL",
  PAY_CLOSED = "PAY_CLOSED",
}

export interface BinancePayCertificateResponse {
  status: string
  code: string
  data: BinanceWebhookCertificate[]
  errorMessage: string
}

export interface BinanceWebhookCertificate {
  certSerial: string
  certPublic: string
}

