import { Agenda } from '@hokify/agenda'
import config from '../config/Config';
import allDefinitions from '../jobs/definitions'

// establised a connection to our mongoDB database.
const agenda = new Agenda({ 
  db: { 
    address: config.dbUrl, 
  },
});

// listen for the ready or error event.
agenda
 .on('ready', () => console.log("Agenda started!"))
 .on('error', () => console.log("Agenda connection error!"));

// define all agenda jobs
allDefinitions(agenda);

export default agenda;