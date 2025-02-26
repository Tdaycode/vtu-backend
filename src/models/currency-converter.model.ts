import { Schema, model } from 'mongoose';
import { ICache, IErrorLog, IExchange, ILogo, IOldCachedRates, IExchangeDocument, 
  ICacheDocument, IErrorLogDocument,  IOldCachedRatesDocument, ILogoDocument, IExchangeRate, IExchangeRateDocument } from '../interfaces/currency-converter.interface';

const exchangeSchema: Schema<IExchange> = new Schema ({
  key: { type: String, required: true },
  url: { type: String, required: true },
  target: { type: [String], default: undefined  },
  method: { type: String, enum: ['GET', 'POST'] },
  payload: { type: Object }, // Optional payload for POST requests
  mapResponse: { type: String }, // Optional mapping function for response transformation
},{
  timestamps: true,// for createdAt and updatedAt
});

const cacheSchema: Schema<ICache> = new Schema ({
  key: String,
  data: String
},{
  timestamps: true,
});

const exchangeRateSchema: Schema<IExchangeRate> = new Schema ({
  currency: String,
  data: Object
},{
  timestamps: true,
});

const errorLogSchema: Schema<IErrorLog> = new Schema ({
  url: String,
  error: String,
  body: String,
},{
  timestamps: true,
}); 

const oldCachedRatesSchema: Schema<IOldCachedRates> = new Schema ({
  data: String,
  date: String,
  updatedAt: { type: Date, default: Date.now },

});

// Create an index on the updatedAt field
oldCachedRatesSchema.index({ updatedAt: -1 });

const logoSchema: Schema<ILogo> = new Schema ({
  symbol: { type: String, required: true },
  logo: { type: String, required: true },  // Base64 encoded logo
},{
  timestamps: true,
});


const Exchange = model<IExchangeDocument>('Exchange', exchangeSchema);
const ExchangeRate = model<IExchangeRateDocument>('ExchangeRate', exchangeRateSchema);
const OldCachedRates = model<IOldCachedRatesDocument>('OldCachedRates', oldCachedRatesSchema);
const CachedData = model<ICacheDocument>('CachedData', cacheSchema);
const ErrorLog = model<IErrorLogDocument>('ErrorLog', errorLogSchema);
const Logo = model<ILogoDocument>('Logo', logoSchema);

export { Exchange, ExchangeRate, OldCachedRates, CachedData, ErrorLog, Logo };