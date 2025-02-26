import webhookDefinitions from './webhook';
import { Agenda } from '@hokify/agenda';
import giftlyDefinitions from './giftly';
import exchangeRateDefinitions from './exchange-rate';

const definitions = [webhookDefinitions, giftlyDefinitions, exchangeRateDefinitions];

const allDefinitions = (agenda: Agenda) => {
  definitions.forEach((definition) =>  definition(agenda));
};

export default allDefinitions;