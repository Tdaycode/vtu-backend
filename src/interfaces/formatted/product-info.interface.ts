export interface FormattedProductInfo {
  type: string,
  valid?: boolean;
  provider: string
  products: Product[]
}

export interface BettingFormattedProductInfo extends FormattedProductInfo {
  name: string
  customerId: string
}

export interface ElectricityFormattedProductInfo extends FormattedProductInfo {
  customerInfo?: ElectricityCustomerInfo
}

export interface TVFormattedProductInfo extends FormattedProductInfo {
  customerInfo?: TVCustomerInfo
}

export interface ElectricityCustomerInfo {
  name: string
  address: string
  meterNumber: string
  vendType: string
}

export interface TVCustomerInfo {
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
}

export interface Product {
  product_id: string
  hasOpenRange: Boolean
  name: string
  currency: string
  amount?: string
  min_amount?: string
  max_amount?: string
}