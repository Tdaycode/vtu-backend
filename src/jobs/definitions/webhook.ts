import { Agenda } from '@hokify/agenda';
import { JobTypes } from '../../interfaces/job.interface';
import JobHandlers from '../handlers';

const webhookDefinitions = (agenda: Agenda) => {
  agenda.define(JobTypes.KudaWebHook, JobHandlers.processKudaTransactionWebhook);
  agenda.define(JobTypes.IdentityPassWebHook, JobHandlers.processIdentityPassWebhook);
  agenda.define(JobTypes.FlutterwaveWebHook, JobHandlers.processFlutterwaveWebhook);
  agenda.define(JobTypes.BinancePayWebHook, JobHandlers.processBinancePayWebhook);
};

export default webhookDefinitions;