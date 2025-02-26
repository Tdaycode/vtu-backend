import dotenv from 'dotenv';
dotenv.config()
// dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });

const config = {
  port: process.env.PORT,
  dbUrl: process.env.DB_URL ?? '',
  environment: process.env.NODE_ENV,
  activeEnvironment: process.env.ACTIVE_ENVIRONMENT,
  jwtSecret: process.env.JWT_SECRET ?? '',
  sendGridAPIKey: process.env.SENDGRID_API_KEY ?? '',
  jwtAcessExpirationMinutes: 1440,
  jwtRefreshExpirationDays: 365,
  otpExpirationMinutes: 30,
  cryptoSecret: process.env.CRYPTO_SECRET ?? '',
  emailSender: 's',
  twilioSID: process.env.TWILIO_ACCOUNT_SID ?? '',
  twilioToken: process.env.TWILIO_AUTH_TOKEN ?? '',
  twilioVerifySID: process.env.TWILIO_VERIFY_SID ?? '',
  identityPassBaseUrl: process.env.IDENTITYPASS_BASE_URL ?? '',
  identityPassXApiKey: process.env.IDENTITYPASS_X_API_KEY ?? '',
  identityPassAppId: process.env.IDENTITYPASS_APP_ID ?? '',
  identityPassPublicKey: process.env.IDENTITYPASS_PUBLIC_KEY ?? '',

  reloadlyAuthBaseUrl: process.env.RELOADLY_AUTH_BASE_URL ?? '',
  reloadlyClientId: process.env.RELOADLY_CLIENT_ID ?? '',
  reloadlyClientSecret: process.env.RELOADLY_CLIENT_SECRET ?? '',
  reloadlyTopupBaseUrl: process.env.RELOADLY_TOPUP_BASE_URL ?? '', 

  primeAirtimeUserName: process.env.PRIME_AIRTIME_USERNAME ?? '',
  primeAirtimePassword: process.env.PRIME_AIRTIME_PASSWORD ?? '',
  primeAirtimeBaseUrl: process.env.PRIME_AIRTIME_BASE_URL ?? '',

  valueTopupUserName: process.env.VALUE_TOPUP_USERNAME ?? '',
  valueTopupPassword: process.env.VALUE_TOPUP_PASSWORD ?? '',
  valueTopupBaseUrl: process.env.VALUE_TOPUP_BASE_URL ?? '',
  
  flutterwaveSecret: process.env.FLW_SECRET_KEY ?? '',
  flutterwaveBaseUrl: process.env.FLW_BASE_URL ?? '',
  flutterwaveRedirectUrl: process.env.FLW_REDIRECT_URL ?? '',
  flutterwaveSecretHash: process.env.FLW_SECRET_HASH ?? '',
  
  giftlyBaseUrl: process.env.GIFTLY_BASE_URL ?? '',
  giftlyClientId: process.env.GIFTLY_CLIENT_ID ?? '', 
  giftlySecretKey: process.env.GIFTLY_SECRET_KEY ?? '',
  giftlyTerminalId: process.env.GIFTLY_TERMINAL_ID ?? '',
  giftlyTerminalPin: process.env.GIFTLY_TERMINAL_PIN ?? '',

  binancePayBaseUrl: process.env.BINANCE_PAY_BASE_URL ?? '',
  binancePayAPIKey: process.env.BINANCE_PAY_API_KEY ?? '', 
  binancePaySecret: process.env.BINANCE_PAY_SECRET ?? '',
  binancePayWebhookUrl: process.env.BINANCE_PAY_WEBHOOK_URL ?? '',

  kudaBaseUrl: process.env.KUDA_BASE_URL ?? '',
  kudaAPIKey: process.env.KUDA_API_KEY ?? '', 
  kudaEmail: process.env.KUDA_EMAIL ?? '',
  kudaPassword: process.env.KUDA_PASSWORD ?? '',

  interswitchBaseUrl: process.env.INTERSWITCH_BASE_URL ?? '',
  interswitchClientID: process.env.INTERSWITCH_CLIENT_ID ?? '', 
  interswitchSecretKey: process.env.INTERSWITCH_SECRET_KEY ?? '',
  interswitchTerminalID: process.env.INTERSWITCH_TERMINAL_ID ?? '',
  interswitchRequestPrefix: process.env.INTERSWITCH_REQUEST_PREFIX ?? '',
  interswitchPassportBaseUrl: process.env.INTERSWITCH_PASSPORT_BASE_URL ?? '', 
  interswitchCustomerEmail: "orders@telebank.com",
  interswitchCustomerMobile: "2348136995555",

  openExchangeRateBaseUrl: process.env.OPEN_EXCHANGE_RATE_BASE_URL ?? '',
  openExchangeRateAppId: process.env.OPEN_EXCHANGE_RATE_APP_ID ?? '',

  sendchampBaseUrl: process.env.SENDCHAMP_BASE_URL ?? '',
  sendchampPublicKey: process.env.SENDCHAMP_PUBLIC_KEY ?? '', 


  gmailUser: process.env.GMAIL_USER ?? '',
  gmailPassword: process.env.GMAIL_PASSWORD ?? '',
};

export default config;
