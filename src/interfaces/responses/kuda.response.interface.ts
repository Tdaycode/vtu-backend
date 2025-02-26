export interface Response {
  message: string
  status: boolean
}

export interface CreateStaticVirtualAccount extends Response {
  data: {
    accountNumber: string
  }
}

export interface RetrieveVirtualAcoountBalance extends Response {
  data: {
    ledgerBalance: number
    availableBalance: number
    withdrawableBalance: number
  }
}

export interface WithdrawalVirtualAccount {
  requestReference: string
  transactionReference: string
  instrumentNumber: string
  responseCode: string
  status: boolean
  message: string
  data: string
}

export interface TransactionWebhook {
  payingBank: string
  amount: number
  transactionDate: string
  transactionReference: string
  accountName: string
  accountNumber: string
  narrations: string
  transactionType: TransactionWebhookType
  senderName: string
  senderAccountNumber: string
  recipientName?: string
  instrumentNumber: string
  SessionId?: string
  clientRequestRef: string
}

export enum TransactionWebhookType {
  Credit =  "Credit",
  Debit =  "Debit"
}