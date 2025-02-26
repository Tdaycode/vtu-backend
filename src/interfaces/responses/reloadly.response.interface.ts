export interface ReloadlyAccessTokenResponse {
  access_token: string
  scope: string
  expires_in: number
  token_type: string
}

export interface ReloadlyGetOperatorResponse {
  id: number
  operatorId: number
  name: string
  bundle: boolean
  data: boolean
  pin: boolean
  supportsLocalAmounts: boolean
  supportsGeographicalRechargePlans: boolean
  denominationType: string
  senderCurrencyCode: string
  senderCurrencySymbol: string
  destinationCurrencyCode: string
  destinationCurrencySymbol: string
  commission: number
  internationalDiscount: number
  localDiscount: number
  mostPopularAmount: number
  mostPopularLocalAmount: any
  minAmount: number
  maxAmount: number
  localMinAmount: any
  localMaxAmount: any
  country: Country
  fx: Fx
  logoUrls: string[]
  fixedAmounts: any[]
  fixedAmountsDescriptions: FixedAmountsDescriptions
  localFixedAmounts: any[]
  localFixedAmountsDescriptions: LocalFixedAmountsDescriptions
  suggestedAmounts: number[]
  suggestedAmountsMap: SuggestedAmountsMap
  geographicalRechargePlans: any[]
  promotions: Promotion[]
  status: string
}

export interface Country {
  isoName: string
  name: string
}

export interface Fx {
  rate: number
  currencyCode: string
}

interface FixedAmountsDescriptions {}

interface LocalFixedAmountsDescriptions {}

interface SuggestedAmountsMap {}

interface Promotion {
  id: number
  promotionId: number
  operatorId: number
  title: string
  title2: string
  description: string
  startDate: string
  endDate: string
  denominations: string
  localDenominations: string
}


