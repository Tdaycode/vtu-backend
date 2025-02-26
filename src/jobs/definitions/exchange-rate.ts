import { Agenda } from '@hokify/agenda';
import JobHandlers from '../handlers';
import { JobTypes } from '../../interfaces/job.interface';

const exchangeRateDefinitions = (agenda: Agenda) => {
  agenda.define(JobTypes.CurrencyRateUpdate, JobHandlers.updateCurrencyExchangeRate);
  agenda.define(JobTypes.BinanceCurrencyRateUpdate, JobHandlers.updateBinanceCurrencyExchangeRate);
  agenda.define(JobTypes.BinanceCurrencyListUpdate, JobHandlers.updateBinanceCurrencyList);
  agenda.define(JobTypes.DatabaseCurrencyUpdate, JobHandlers.updateDatabaseExchangeRate);
  agenda.every("0 * * * *", JobTypes.CurrencyRateUpdate);
};

export default exchangeRateDefinitions;