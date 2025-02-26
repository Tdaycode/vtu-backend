import { JobTypes } from "../interfaces/job.interface";
import agenda from "../utils/agenda";

const schedule = {
  processKudaTransactionWebhook: async (data: any) => {
    await agenda.now(JobTypes.KudaWebHook, data);
  },
  processIdentityPassWebhook: async (data: any) => {
    await agenda.now(JobTypes.IdentityPassWebHook, data);
  },
  processFlutterwaveWebhook: async (data: any) => {
    await agenda.now(JobTypes.FlutterwaveWebHook, data);
  },
  processBinancePayWebhook: async (data: any) => {
    await agenda.now(JobTypes.BinancePayWebHook, data);
  },
  processBinanceCurrencyUpdate: async (data: any, minutes: number) => {
    await agenda.schedule(`in ${minutes} minutes`, JobTypes.BinanceCurrencyRateUpdate, data);
  },
  processBinanceListUpdate: async (data: any, minutes: number) => {
    await agenda.schedule(`in ${minutes} minutes`, JobTypes.BinanceCurrencyListUpdate, data);
  },
  processDatabaseCurrencyUpdate: async (data: any, minutes: number) => {
    await agenda.schedule(`in ${minutes} minutes`, JobTypes.DatabaseCurrencyUpdate, data);
  },
}

export default schedule;