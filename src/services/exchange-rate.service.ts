import { Service } from 'typedi';
import { LoggerClient } from './logger.service';
import axios from 'axios';
import { exchangeRateSources } from '../config/exchange-rate-sources';
import { ExchangeRateProvider } from '../providers/exchangerate.provider';
import { ExchangeRepository, CachedDataRepository, OldCachedRatesRepository, ErrorLogRepository, LogoRepository, ExchangeRateRepository } from '../repositories/currency-converter.repository';
import schedule from '../jobs/schedule';

interface DataItem {
  symbol: string;
  price: string;
}

const mappingFunctions = {
  // This function returns an array of objects
  extractCurrencyCodeObjects: (data: any) => data.map(({ currencyCode }) => ({ currencyCode })),
  // This function returns an array of strings
  extractCurrencyCodeStrings: (data: any) => data.map(({ currencyCode }) => currencyCode),
};

@Service()
export default class ExchangeRateService {
  constructor(
    public logger: LoggerClient,
    public exchangeRepository: ExchangeRepository,
    public exchangeRateRepository: ExchangeRateRepository,
    public cachedDataRepository: CachedDataRepository,
    public oldCachedRatesRepository: OldCachedRatesRepository,
    public errorLogRepository: ErrorLogRepository,
    public logoRepository: LogoRepository,
    public exchangeRateProvider: ExchangeRateProvider
  ) { }

  public async updateCurrencyExchangeRate() {
    const errorLogs: any[] = [];

    await Promise.all(
      exchangeRateSources.map(async (data) => {
        const { key, url, target, method, payload, mapResponse } = data;
        try {
          let jsonData: any;
          let extractedData: any;
          let cacheArray: any[] = [];  // Initialize the cache array for multiple fiat currencies

          if (method === 'POST') {
            if (key === 'BINANCEP2PUSDT') { // Special case
              if (Array.isArray(payload.fiat)) {  // Check if payload.fiat is an array
                // const fiats = payload.fiat;  
                //  let fiats = fiatArray.length > 0 ? fiatArray : payload.fiat; // Fetch FIAT symbols from BIANANCEFIATLIST for payload
                let fiats = payload.fiat;// Use our inputted fiat payload from BINANCEP2PUSDT
                // console.log(typeof fiats); // If this returns "string", then fiats is a string, not an array.
                if (typeof fiats === 'string') {
                  try {
                    fiats = JSON.parse(fiats);
                  } catch (e) {
                    console.error("Failed to parse fiats:", e);
                  }
                }

                if (Array.isArray(fiats)) {
                  const finalFiats = fiats.slice(0, 5);
                  await Promise.all(
                    finalFiats.map(async (fiat) => {
                      const newPayload = { ...payload, fiat };
                      const response = await this.postJson(key, url, newPayload);
                      // console.log(`Posting data with payload: ${JSON.stringify(newPayload)}`); // Log the payload
                      jsonData = response;
                      extractedData = this.getValueByTarget(jsonData, target);
                      // Check if extractedData is null or 0 before pushing
                      if (extractedData !== null && extractedData !== 0 && extractedData !== "") {
                        // Push each fiat symbol and its corresponding price to the array
                        cacheArray.push({
                          symbol: `USDT${fiat}`,
                          price: extractedData
                        });
                      }
                    })

                  )
                  // Send to quee
                  const remainingItems = fiats.slice(5);
                  await this.scheduleJobs(remainingItems);
                } else {
                  console.error('fiats is not an array:', fiats);
                };

                // if(Array.isArray(cacheArray) && cacheArray.length > 0)
                  await this.updateCache(key, cacheArray);
              }
            } else {
              jsonData = await this.postJson(key, url, payload);
              extractedData = this.getValueByTarget(jsonData, target);
            }
          } else {
            jsonData = await this.getJson(key, url);
            extractedData = this.getValueByTarget(jsonData, target); 
          }
          // Remove BTC from the openexchangerates currency of BNFIATLIST before saving to db.
          if (extractedData && key === 'BNFIATLIST' && extractedData.hasOwnProperty('BTC')) {
            delete extractedData['BTC'];
          }

          // Map the response data if a mapping function is provided
          if (mapResponse !== undefined) {
            const mapFunction = mappingFunctions[mapResponse];
            if (typeof mapFunction === 'function') {
              try {
                extractedData = mapFunction(extractedData);
                if (key !== 'BINANCEP2PUSDT') {
                  await this.updateCache(key, extractedData);
                }
              } catch (error: any) {
                console.error(`Error running mapResponse for URL ${url}:`, error);
                errorLogs.push({ url, error: error.message });
              }
            } else {
              console.error(`Invalid usage of mapResponse for URL ${url}`);
              errorLogs.push({ url, error: 'Invalid usage of mapResponse' });
            }
          } else {
            if (key !== 'BINANCEP2PUSDT') {
              await this.updateCache(key, extractedData);
            }
          }

        } catch (error: any) {
          console.error(`Error loading URL ${url}:`, error);
          errorLogs.push({ url, error: error.message });
        }
      })
    );

    // Save error logs to the database
    await this.errorLogRepository.insertMany(errorLogs);

    console.log("Data updated successfully")
    return true;
  }

  public async updateBinanceCurrencyExchangeRate(fiats: string[]) {
    try {
      const exchangeRateSource = exchangeRateSources.find((source) => source.key === 'BINANCEP2PUSDT');
      if(!exchangeRateSource) return;
      const { key, url, target, payload } = exchangeRateSource;

      const cachedData = await this.cachedDataRepository.findSingle({ key });
      if(!cachedData) return;
      const currentData = JSON.parse(cachedData?.data);
      if(!Array.isArray(currentData) && currentData?.length === 0) return;

      console.log("currentData", currentData)
      const newData = this.removeItems(currentData, fiats);
  
      let jsonData: any;
      let extractedData: any;
      let cacheArray: DataItem[] = newData;
  
      await Promise.all(
        fiats.map(async (fiat) => {
          const newPayload = { ...payload, fiat };
          const response = await this.postJson(key, url, newPayload);
          // console.log(`Posting data with payload: ${JSON.stringify(newPayload)}`); // Log the payload
          jsonData = response;
          extractedData = this.getValueByTarget(jsonData, target);
          // Check if extractedData is null or 0 before pushing
          if (extractedData !== null && extractedData !== 0 && extractedData !== "") {
            // Push each fiat symbol and its corresponding price to the array
            cacheArray.push({
              symbol: `USDT${fiat}`,
              price: extractedData
            });
          }
        })
      )

      await this.updateCache(key, cacheArray);
  
      if (extractedData && key === 'BNFIATLIST' && extractedData.hasOwnProperty('BTC')) {
        delete extractedData['BTC'];
      }
  
      console.log("Data updated successfully")
      return true;
    } catch (error) {
      console.error('An error occurred while updating currency cache:', error);
    }
  }

  public async updateBinanceList() {
    try {
      const exchangeRateSource = exchangeRateSources.find((source) => source.key === 'BNFIATLIST');
      if(!exchangeRateSource) return;
      const { key, url, target, payload, mapResponse } = exchangeRateSource;

      let jsonData: any;
      let extractedData: any;
  
      jsonData = await this.postJson(key, url, payload);
      extractedData = this.getValueByTarget(jsonData, target);
  
      if (extractedData && key === 'BNFIATLIST' && extractedData.hasOwnProperty('BTC')) {
        delete extractedData['BTC'];
      }

      // Map the response data if a mapping function is provided
      if (mapResponse !== undefined) {
        const mapFunction = mappingFunctions[mapResponse];
        if (typeof mapFunction === 'function') {
          try {
            extractedData = mapFunction(extractedData);
            if (key !== 'BINANCEP2PUSDT') {
              await this.updateCache(key, extractedData);
            }
          } catch (error: any) {
            console.error(`Error running mapResponse for URL ${url}:`, error);
          }
        } else {
          console.error(`Invalid usage of mapResponse for URL ${url}`);
        }
      } else {
        if (key !== 'BINANCEP2PUSDT') {
          await this.updateCache(key, extractedData);
        }
      }

      console.log("Data updated successfully")
      return true;
    } catch (error) {
      console.error('An error occurred while updating currency cache:', error);
    }
  }

  public async updateDatabaseExchangeRate() {
    try {
      const rates = await this.getCurrencyExchangeRate();
      if(!rates) return;
      const fiateRates = rates.FIAT;
      for(const rate in fiateRates) {
        await this.exchangeRateRepository.findAndUpdate({ currency: rate }, { data: fiateRates[rate] }, { upsert: true });
      }
      return true;
    } catch (error) {
      console.error('An error occurred while updating currency cache:', error);
    }
  } 

  private async scheduleJobs(items: string[]) {
    let minutes = 0;
    for (let i = 0; i < items.length; i += 5) {
        const batch = items.slice(i, i + 5);
        minutes += 2;
        console.log("batch", batch, "minutes", minutes);
        schedule.processBinanceCurrencyUpdate(batch, minutes);
    }
    schedule.processBinanceListUpdate({}, minutes + 2);
    schedule.processDatabaseCurrencyUpdate({}, minutes + 3);
  }

  private removeItems(data: DataItem[], symbols: string[]): DataItem[] {
    if(!Array.isArray(data) || data.length === 0) return [];
    return data.filter(item => {
        for (const symbol of symbols) {
            if (item.symbol.includes(symbol)) {
                return false;
            }
        }
        return true;
    });
  }

  getValueByTarget(obj: any, target: any[] = []) {
    return target.reduce((result, key) => (result ? result[key] : undefined), obj);
  }

  formatDateToDayMonthYear(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}${month}${year}`;
  }

  async getJson(key: string, url: string, useAgent = true) {
    try {
      let cachedData = await this.cachedDataRepository.findSingle({ key });

      if (cachedData?.data) {
        const oneMinuteInMilliseconds = 60 * 1000; //One minute update
        const oneHourInMilliseconds = 60 * 60 * 1000; //One hour update
        let updateInterval;
        if (key === 'BNFIATLIST' || key === 'BINANCEP2PUSDT') {
          updateInterval = oneHourInMilliseconds;
        } else { updateInterval = oneMinuteInMilliseconds; } // Update interval set to one hour for 'GLOBALDATA' key and one minute for others
        const timeAgo = new Date(Date.now() - updateInterval);
        if (cachedData.updatedAt > timeAgo) {
          return JSON.parse(cachedData.data);
        }
      }

      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Connection: 'Keep-Alive',
          'User-Agent': useAgent ? 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' : ""
        },
      });

      const jsonData = response.data;
      //Code to check for empty data
      const isEmptyObject = (obj) => Object.keys(obj).length === 0;//{}
      const isEmptyArray = (arr) => arr.length === 0;//[]
      if (jsonData !== false && jsonData !== '' && !isEmptyObject(jsonData) && !isEmptyArray(jsonData)) {
        if (cachedData) {
          // Update existing cache asynchronously
          await this.updateCache(key, jsonData);
        } else {
          // Create new cache asynchronously
          await this.createCache(key, jsonData);
        }

        return jsonData;
      }
    } catch (error: any) {
      console.error('An error occurred:', error);
      // Save the error to the error log
      //   const errorLog = new ErrorLog({ url, error: error.message });
      const errorLog = { url, error: error.message, body: error.response && error.response.data ? JSON.stringify(error.response.data) : "" };
      await this.errorLogRepository.create(errorLog);
      throw error;
      throw error; // Rethrow the error to be caught by the caller
    }
  }

  // Utility function to make a POST request
  async postJson(key: string, url: string, payload: any) {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Connection: 'Keep-Alive',
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        },
      });

      const jsonData = response.data;

      let cachedData = await this.cachedDataRepository.findSingle({ key });

      // if(key === "BINANCEP2PUSDT" && !Array.isArray(jsonData)) return;
    
      if (cachedData) {
        // Update existing cache asynchronously
        await this.updateCache(key, jsonData);
      } else {
        // Create new cache asynchronously
        const newCachedData = {
          key: key,
          data: JSON.stringify(jsonData),
        };
        await this.cachedDataRepository.create(newCachedData);
      }

      return jsonData;
    } catch (error: any) {
      console.error('Error in POST request:', error);
      // Save the error to the error log
      const errorLog = { url, error: error.message, body: error.response && error.response.data ? JSON.stringify(error.response.data) : "" };
      await this.errorLogRepository.create(errorLog);
      // throw error;
    }
  }

  async updateCache(key: string, jsonData: any) {
    try {
      const filter = { key };
      let update: any = { data: JSON.stringify(jsonData) };
      if (key === 'LATESTCRYPTOCACHE') {//This only runs when v1/rates run
        // If the key is 'LATESTCRYPTOCACHE', directly update it without any conditions
        update.updatedAt = Date.now();
        await this.cachedDataRepository.findOneAndUpdate(filter, update, { upsert: true, new: true });
      } else {
        // Check if the key requires updating the updatedAt field
        if (key === 'GLOBALDATA' || key === 'BNFIATLIST' || key === 'BINANCEP2PUSDT') {

          // Update interval for GLOBALDATA is one hour
          const oneHourInMilliseconds = 60 * 60 * 1000;
          const timeAgo = new Date(Date.now() - oneHourInMilliseconds);

          // Check if the existing cache is older than one hour
          const cachedData = await this.cachedDataRepository.findSingle({ key });
          if (!cachedData || cachedData.updatedAt <= timeAgo) {
            update.updatedAt = Date.now();
          }
        } else if (key === 'YSTDATA') {
          // Step 1: Fetch the LATESTCRYPTOFIATCACHE data
          const latestCacheData = await this.cachedDataRepository.findSingle({ key: 'LATESTCRYPTOFIATCACHE' });
          // If LATESTCRYPTOFIATCACHE data is not available, we simply exit this block without doing any updates
          if (!latestCacheData) return;

          // Use the data from LATESTCRYPTOFIATCACHE for updates
          const cacheToUpdateWith = latestCacheData.data;

          // Check if YSTDATA exists in CachedData
          const existingYstCachedData = await this.cachedDataRepository.findSingle({ key });
          const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Calculate the duration for a day in milliseconds
          const now = Date.now();

          if (existingYstCachedData) {
            // YSTDATA exists in CachedData
            const ystdataupdatedAt = existingYstCachedData.updatedAt.getTime();

            if (now - ystdataupdatedAt >= oneDayInMilliseconds) {
              // If YSTDATA is older than 24 hours, update it with the data from LATESTCRYPTOFIATCACHE
              existingYstCachedData.data = cacheToUpdateWith;
              existingYstCachedData.updatedAt = new Date(now);
              await existingYstCachedData.save();
            }
            // If YSTDATA is not more than 24 hours old, do not update it.
          } else {
            // YSTDATA does not exist in CachedData, so create a new entry with the data from LATESTCRYPTOFIATCACHE
            const newCachedData = { key, data: cacheToUpdateWith, updatedAt: now };
            await this.cachedDataRepository.create(newCachedData);
          }


          //YSTDATA
          const latestYstCachedData = await this.cachedDataRepository.findSingle({ key: 'YSTDATA' });
          const latestYstData = latestYstCachedData?.data

          // Check if OldCachedRates collection exists
          const existingEntryOldCachedRates = await this.oldCachedRatesRepository.findSingle({});


          if (!existingEntryOldCachedRates) {
            await this.oldCachedRatesRepository.create({});

            // Fetch 24hr rate based on the current YSTDATA
            const formattedDate = this.formatDateToDayMonthYear(new Date(now));
            const newTodayRate = { data: latestYstData, date: formattedDate, updatedAt: now };
            await this.oldCachedRatesRepository.create(newTodayRate);
          } else {
            // OldCachedRates collection exists, check if any rate has been saved
            const lastRate = await this.oldCachedRatesRepository.getLastRate();
            const lastUpdateTimestampOldCachedRates = lastRate ? lastRate.updatedAt.getTime() : 0;

            if (now - lastUpdateTimestampOldCachedRates >= oneDayInMilliseconds) {
              // It's more than 24 hours since the last rate was saved, create today's rate based on the current YSTDATA
              const formattedDate = this.formatDateToDayMonthYear(new Date(now));
              const newTodayRate = { data: latestYstData, date: formattedDate, updatedAt: now };
              await this.oldCachedRatesRepository.create(newTodayRate);
            }
            // If it's not more than 24 hours since the last rate was saved, do not create today's rate.
          }

          // Fetch all OldCachedRates
          const allRates = await this.oldCachedRatesRepository.find({});

          // Filter the ones not ending in :00.000+00:00 and make them use it using JavaScript
          const ratesToUpdate = allRates.filter(rate => {
            return !rate.updatedAt.toISOString().endsWith("55:00.000+00:00");
          });

          // Correct the timestamps for the filtered rates
          for (const rate of ratesToUpdate) {
            const timestamp = rate.updatedAt;
            timestamp.setUTCHours(timestamp.getUTCHours(), 55, 0, 0);  // Keep the hour same, set minutes to 55 and seconds and milliseconds to 0
            rate.updatedAt = timestamp;
            rate.markModified('updatedAt');//Telling MongoDB we want to manully update updatedAt
            await rate.save();
          }

        } else {
          // Update interval for other keys is one minute
          const oneMinuteInMilliseconds = 60 * 1000;
          const timeAgo = new Date(Date.now() - oneMinuteInMilliseconds);

          // Check if the existing cache is older than one minute
          const cachedData = await this.cachedDataRepository.findSingle({ key });
          if (!cachedData || cachedData.updatedAt <= timeAgo) {
            update.updatedAt = Date.now();
          }
        }

        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        await this.cachedDataRepository.findOneAndUpdate(filter, update, { ...options, timestamps: false });//Tell mongodb not to assign timestamp automatically so that our update timing code can work. Former code: await this.cachedDataRepository.findOneAndUpdate(filter, update, options);
      }
    } catch (error) {
      console.error('An error occurred while updating cache:', error);
    }
  }

  // Asynchronously create a new cache
  async createCache(key: string, jsonData: any) {
    try {
      const newCache = { key, data: JSON.stringify(jsonData) };
      await this.cachedDataRepository.create(newCache);
    } catch (error) {
      console.error('An error occurred while creating cache:', error);
    }
  }

  // Retrieve the cached data from the database
  async getCachedData() {
    try {
      const cachedData = await this.cachedDataRepository.find({});
      const oldCachedRatesData = await this.oldCachedRatesRepository.find({});

      return {
        cacheddata: cachedData.reduce((data, cache) => {
          if(cache?.data) {
            data[cache.key] = JSON.parse(cache.data);
          }
          return data;
        }, {}),
        oldcacheddatas: oldCachedRatesData.reduce((data, cache) => {
          const { date, data: jsonData } = cache;
          data[date] = jsonData ? JSON.parse(jsonData) : null; // Use the "date" field as the key
          return data;
        }, {}),
      };
    } catch (error) {
      console.error('An error occurred while retrieving cached data:', error);
      throw error;
    }
    // Function to insert or update data into the Exchanges collection
  }
  // Function to insert or update data into the Exchanges collection
  async insertExchangesData(exchangesData: any) {
    try {
      // Loop through the data and update each item
      for (const exchangeData of exchangesData) {
        const { key, ...data } = exchangeData;
        // Update the document if the key matches or insert a new document if it doesn't exist
        await this.exchangeRepository.findOneAndUpdate({ key }, { $set: data }, { upsert: true });
      }

      console.log('Data inserted/updated successfully.');
    } catch (error) {
      console.error('Error inserting/updating data:', error);
      throw error;
    }
  }

  getPairValue(binancep2pData: any[], pairSymbol: string, BNFIATLIST: any[]) {
    const fiatKeys = Object.keys(BNFIATLIST);//This was added because our fiatlist currency code are objects.
    const fiatSet = new Set(fiatKeys.map(key => key.toUpperCase()));
    const normalizedPairSymbol = pairSymbol.toUpperCase();  // Normalize to uppercase

    //fiat exclusion list for cryptos with fiat symbol in some data.
    const FIAT_EXCLUSION_LIST = {
      binance: new Set(['ERNUSDT', 'USDTNGN']),
      hitbtc: new Set([] as any[]),
      huobi: new Set(['MNTUSDT', 'TOPUSDT', 'BOBUSDT', 'LBPUSDT', 'ERNUSDT']),  // These are crypto in Huobi not fiat
      binancep2p: new Set([] as any[]),
    };

    // Helper function to determine if the pair represents a fiat currency
    function isFiatPair(symbol, dataSource) {
      const uppercasedSymbol = symbol.toUpperCase();  // Convert to uppercase
      const currency = uppercasedSymbol.replace('USDT', '');
      return fiatSet.has(currency) &&
        (!FIAT_EXCLUSION_LIST[dataSource] || !FIAT_EXCLUSION_LIST[dataSource].has(uppercasedSymbol));
    }

    let Data4 = binancep2pData.find(item => item.symbol === normalizedPairSymbol);


    let returnValue = null;

    // Check Binance P2P Data
    if (!returnValue && Data4 && !FIAT_EXCLUSION_LIST.binancep2p.has(normalizedPairSymbol)) {
      // Check if price is non-zero
      if (parseFloat(Data4.price) !== 0) {
        let Data4Value = Data4.price;

        // Set returnValue to Data4Value
        returnValue = Data4Value;
      }
    }


    // Return either a found value or null
    return returnValue;
  }

  async importfiatData(cacheddata: any) {
    const pairsData = {};
  
    const fiatPairsData = {};
  
  
    for (let pair of cacheddata.BINANCEP2PUSDT) {
        const btcPair = this.extractPairedCurrency(pair.symbol.toUpperCase());
        const usdtPair = this.extractUSDTPair(pair.symbol.toUpperCase());
        if (btcPair && !pairsData[btcPair]) {
            const btcPairValue = this.getPairValue(cacheddata.BINANCEP2PUSDT,  pair.symbol, cacheddata.BNFIATLIST);
            if (btcPairValue) {
                pairsData[btcPair] = btcPairValue;
            }
        }
  
        if (usdtPair && !fiatPairsData[usdtPair]) {
            const usdtPairValue = this.getPairValue(cacheddata.BINANCEP2PUSDT,  pair.symbol, cacheddata.BNFIATLIST);
            if (usdtPairValue) {
                fiatPairsData[usdtPair] = usdtPairValue;
            }
        }
  
    }

    if(cacheddata.OKXUSDTNGN) {
      const usdtngnValue = cacheddata.OKXUSDTNGN?.price;
      fiatPairsData["usdtngn"] = usdtngnValue;
    }
  
    const result = {
      USDTMARKET: fiatPairsData,
    };
  
    return result;
  }

  public async getCurrencyExchangeRate() {
    try {
      const data = await this.getCachedData(); 
      //CRYPTODATA 
      const cryptodata = await this.importfiatData(data.cacheddata);// this directly uses the formatted output from cryptodata.js
      //Save cryptodata to cache so we can use it's data in fiatdata.js
      await this.updateCache('LATESTCRYPTOCACHE', cryptodata);

      // Fetch the latest cache after updating it with crypto data for use in fiatdata.js
      const latestCryptoData = await this.getCachedData();

      //FIATDATA
      const fiatdata = await this.fetchFiatData(latestCryptoData.cacheddata);
      // Merge the fiat and crypto data
      const mergedData = { ...fiatdata };

      // Save the latest full rates after updating it with crypto and fiat data for use in YSTDATA
      await this.updateCache('LATESTCRYPTOFIATCACHE', mergedData);

      // Format each property of cryptodata as a string and add a newline after it
      const formattedData = Object.entries(mergedData)
        .map(([key, value]) => JSON.stringify({ [key]: value }))
        .join(',\n');

      const output = `{\n${formattedData}\n}`;
      return mergedData;
    } catch (error: any) {
      this.logger.error(error);
    }
  }

  customToFixed(number: number, decimalPlaces: number) {
    // Round to decimalPlaces initially
    const fixedDecimal = number.toFixed(decimalPlaces);

    // Check if the number would round to zero but the original number is greater than zero
    if (number > 0 && parseFloat(fixedDecimal) === 0) {
      return parseFloat("1e-" + decimalPlaces).toFixed(decimalPlaces);
    }

    // Extract the integer and decimal parts
    const [whole, decimal] = fixedDecimal.split('.');

    // If the integer part is greater than zero or the first two decimal digits are greater than zero,
    // round to two decimal places
    if (parseInt(whole, 10) > 0 || parseInt(decimal.slice(0, 2), 10) > 0) {
      return number.toFixed(2);
    }

    // Otherwise, return the number rounded to decimalPlaces
    return fixedDecimal;
  }

  extractPairedCurrency(normalizedPairSymbol) {
    if (/^BTC.{3}BTC$/.test(normalizedPairSymbol)) {
      return `btc${normalizedPairSymbol.slice(3, -3).toLowerCase()}btc`;
    } else if (normalizedPairSymbol.endsWith('BTC')) {
      return `btc${normalizedPairSymbol.slice(0, -3).toLowerCase()}`;
    } else if (normalizedPairSymbol.startsWith('BTC')) {
      return normalizedPairSymbol.toLowerCase();
    }
    return '';
  }

  extractUSDTPair(normalizedPairSymbol) {
    if (/^USDT.{4}USDT$/.test(normalizedPairSymbol)) {
      return `usdt${normalizedPairSymbol.slice(4, -4).toLowerCase()}usdt`;
    } else if (normalizedPairSymbol.endsWith('USDT')) {
      return `usdt${normalizedPairSymbol.slice(0, -4).toLowerCase()}`;
    } else if (normalizedPairSymbol.startsWith('USDT')) {
      return normalizedPairSymbol.toLowerCase();
    }
    return '';
  }

  calculateNGNPriceFromUSDT(usdtngnValue, pairValue) {
    const value = parseFloat(pairValue);
    return usdtngnValue && value ? (usdtngnValue * value).toFixed(2) : '0';
  }

  convertToCurrency(usdtValueForCurrency, usdtValueOfCrypto) {
    const valueForCurrency = parseFloat(usdtValueForCurrency);
    const valueOfCrypto = parseFloat(usdtValueOfCrypto);
    return (valueForCurrency && valueOfCrypto) ? (valueForCurrency * valueOfCrypto).toFixed(2) : '0';
  }

  // This  will fetch the supply for a given symbol
  getSupplyForSymbol(symbol, coinCapData) {
    if (symbol === "IOTA") {
      symbol = "MIOTA"; // Handling the IOTA exception
    }
    const coinData = coinCapData.data.find(coin => coin.symbol === symbol);
    return coinData ? coinData.supply : '0';
  }

  getNameForSymbol(symbol, coinCapData) {
    if (symbol === "IOTA") {
      symbol = "MIOTA"; // Handling the IOTA exception
    }
    const coinData = coinCapData.data.find(coin => coin.symbol === symbol);
    return coinData ? coinData.name : symbol;
  }

  getSymbolForSymbol(symbol, coinCapData) {
    if (symbol === "IOTA") {
      symbol = "MIOTA"; // Handling the IOTA exception
    }
    const coinData = coinCapData.data.find(coin => coin.symbol === symbol);
    return coinData ? coinData.symbol : symbol;
  }

  getExplorerForSymbol(symbol, coinCapData) {
    if (symbol === "IOTA") {
      symbol = "MIOTA"; // Handling the IOTA exception
    }
    const coinData = coinCapData.data.find(coin => coin.symbol === symbol);
    return coinData ? coinData.explorer : null;
  }


  // Utility  to compute the cap for a cryptocurrency
  calculateCap(supply, price) {
    const cryptoSupply = parseFloat(supply);
    const cryptoPrice = parseFloat(price);

    if (!isNaN(cryptoSupply) && !isNaN(cryptoPrice)) {
      return (cryptoSupply * cryptoPrice).toFixed(2);
    }
    return '0';
  }

  async fetchFiatData(cacheddata: Record<string, any>) {
    const FIAT_KEY = "FIAT";
    const fiatRates: [] = cacheddata.BNFIATLIST;
    let result: Record<string, any> = {};
    result[FIAT_KEY] = {};
    const usdtMarket = cacheddata.LATESTCRYPTOCACHE.USDTMARKET; 

    const EXCLUSION_LIST = new Set(['usdttop', 'usdtbob', 'usdtlbp', 'usdtmnt', 'usdtern']); // Exclusion set
    const MARKUP_PERCENTAGE = 0.07;//For derived rates


    for (const [currency, otherCurrencyBankUsdrate] of Object.entries(fiatRates)) {
      const p2pRateKey = `usdt${currency.toLowerCase()}`;

      if (!EXCLUSION_LIST.has(p2pRateKey)) {
        const p2pusdrate = usdtMarket[p2pRateKey] || null;
        result[FIAT_KEY][currency] = {
          "Bank": {},
          "p2p": {},
          "exchanges": {}
        };


        // Handle USD p2p rate within the loop
        if (currency === "USD") {
          result[FIAT_KEY]['USD']['p2p']['Real'] = {};
          result[FIAT_KEY]['USD']['p2p']['Derived'] = {};

          for (const fiatCurrency of Object.keys(fiatRates)) {
            const currentP2pRateKey = `usdt${fiatCurrency.toLowerCase()}`;
            const rate = usdtMarket[currentP2pRateKey];

            // If the currency is present in usdtMarket and is not in the exclusion list, calculate the real rate
            if (!EXCLUSION_LIST.has(currentP2pRateKey) && rate) {
              result[FIAT_KEY]['USD']['p2p']['Real'][fiatCurrency.toLowerCase()] = 1 / rate;
            } else {
              // If not present, calculate the derived rate based on bank rate with a 3% markup
              const bankUsdRateForCurrency = fiatRates[fiatCurrency];
              if (bankUsdRateForCurrency && bankUsdRateForCurrency !== 0) {
                const derivedRate = (1 / bankUsdRateForCurrency) * (1 - MARKUP_PERCENTAGE);
                result[FIAT_KEY]['USD']['p2p']['Derived'][fiatCurrency.toLowerCase()] = derivedRate;
              }
            }
          }
        }


        // Bank rates for the current currency
        for (const [fiatCurrency, currencyBankUsdRate] of Object.entries(fiatRates)) {
          result[FIAT_KEY][currency]["Bank"][fiatCurrency.toLowerCase()] = otherCurrencyBankUsdrate / currencyBankUsdRate;
        }

        if (p2pusdrate) {
          const derivedp2pRates = {}; // Collect derived rates here first

          // P2P rates for the current currency
          for (const [fiatCurrency, currencyBankUsdRate] of Object.entries(fiatRates)) {
            const otherP2pRateKey = `usdt${fiatCurrency.toLowerCase()}`;

            if (currencyBankUsdRate === 0) {
              continue; // Skip this loop iteration if the bank USD rate is zero
            }

            if (otherP2pRateKey in usdtMarket && !EXCLUSION_LIST.has(otherP2pRateKey)) {
              if (!result[FIAT_KEY][currency]["p2p"]["Real"]) {
                result[FIAT_KEY][currency]["p2p"]["Real"] = {};
              }
              result[FIAT_KEY][currency]["p2p"]["Real"]["usd"] = parseFloat(p2pusdrate);//For usd rates
              result[FIAT_KEY][currency]["p2p"]["Real"][fiatCurrency.toLowerCase()] = (p2pusdrate / usdtMarket[otherP2pRateKey]);//For other known p2p rates
            } else if (fiatCurrency !== "USD") {
              //  else {
              //Derivative rates for remianing currency for the p2p known currencies in USDTMARKET.
              // result[FIAT_KEY][currency]["p2p"][fiatCurrency.toLowerCase()] = (1 / currencyBankUsdRate) * p2pusdrate;//This will derive p2p rates without seperation. Make sure to delete all derivedp2pRates code lines.
              derivedp2pRates[fiatCurrency.toLowerCase()] = (1 / currencyBankUsdRate) * p2pusdrate;
            }
          }
          // Add derived rates after all known p2p rates have been added
          if (Object.keys(derivedp2pRates).length > 0) {
            result[FIAT_KEY][currency]["p2p"]["Derived"] = derivedp2pRates;
          }

          // Add exchange rates if currency is NGN
          if (currency === "NGN") {
            result[FIAT_KEY][currency]["exchanges"] = {
              "Luno": cacheddata.LUNOTICKER,
              "Quidax": cacheddata.QUIDAXTICKER
            };
          }
        }
      }
    }


    // Now, for currencies NOT in usdtMarket: Just add 3% to their bank rates

    for (const [currency, _] of Object.entries(fiatRates)) {
      const p2pRateKey = `usdt${currency.toLowerCase()}`;

      if (!(p2pRateKey in usdtMarket) && result[FIAT_KEY]?.[currency]?.["Bank"]) {// Ensure that the current currency has bank rates before processing
        if (!result[FIAT_KEY][currency]["p2p"]["Derived"]) {
          result[FIAT_KEY][currency]["p2p"]["Derived"] = {};
        }

        for (const [fiatCurrency, bankRate] of Object.entries(result[FIAT_KEY][currency]["Bank"])) {
          const derivedP2pRate = bankRate as number * (1 + MARKUP_PERCENTAGE);
          result[FIAT_KEY][currency]["p2p"]["Derived"][fiatCurrency.toLowerCase()] = derivedP2pRate;
        }
      }
    }
    return result;
  }
}

