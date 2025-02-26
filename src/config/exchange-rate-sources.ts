export const exchangeRateSources = [
{
  "key": "BINANCEP2PUSDT",
  "method": "POST",
  "payload": {
    "fiat": [
      "NGN",
      "CNY",
      "XOF",
      "AUD",
      "AED",
      "EGP",
      "EUR",
      "CAD",
      "PKR",
      "KWD",
      "BHD",
      "OMR",
      "JOD",
      "QAR",
      "SGD",
      "INR",
      "MXN",
      "CLP",
      "COP",
      "PEN",
      "SAR",
      "TRY",
      "GBP",
      "XAF",
      "GHS",
      "ZAR",
      "RWF",
      "KES",
      "MWK",
      "MAD",
      "SLL",
      "STD",
      "TZS",
      "UGX",
      "ZMW",
    ],
    "page": 1, 
    "rows": 10, 
    "tradeType": "buy",
    "asset": "USDT",
    "countries": [],
    "proMerchantAds": false,
    "publisherType": null,
    "payTypes": []
  },
  "target": [
    "data",
    "0",
    "adv",
    "price"
  ],
  "url": "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"
},
{
  "key": "BINANCEFIATLIST",
  "mapResponse": "extractCurrencyCodeStrings",
  "method": "POST",
  "payload": {},
  "target": [
    "data"
  ],
  "url": "https://p2p.binance.com/bapi/c2c/v1/friendly/c2c/trade-rule/fiat-list"
},
{
  "key": "OKXUSDTCNY",
  "target": [
    "data",
    "sell",
    "0"
  ],
  "url": "https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=cny&baseCurrency=usdt&side=sell&paymentMethod=bank&userType=all&receivingAds=false"
},
{
  "key": "OKXUSDTNGN",
  "target": [
    "data",
    "sell",
    "0"
  ],
  "url": "https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=NGN&baseCurrency=usdt&side=sell&paymentMethod=bank&userType=all&receivingAds=false"
},
{
  "key": "BNFIATLIST",
  "target": [
    "rates"
  ],
  "url": "https://openexchangerates.org/api/latest.json?app_id=297147e52af048edb128b4a046308bf9"
}
];