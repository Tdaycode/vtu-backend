import { Agenda } from '@hokify/agenda';
import JobHandlers from '../handlers';
import { JobTypes } from '../../interfaces/job.interface';

const giftlyDefinitions = (agenda: Agenda) => {
  agenda.define(JobTypes.CheckGiflyCatalog, JobHandlers.checkGiftlyCatalogForUpdate);
  agenda.every("0 2 * * *", JobTypes.CheckGiflyCatalog);
};

export default giftlyDefinitions;