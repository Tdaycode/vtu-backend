import 'reflect-metadata';
import Agendash from 'agendash';
import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { NotFoundError } from './utils/ApiError';
import ErrorHandler from './middlewares/error.middleware';
import Config from './config/Config';
import routes from './routes';
import http from 'http';
import cors from 'cors';
import Database from './config/database';
import agenda from './utils/agenda';
import config from './config/Config';
import Agenda from 'agenda';

const app: Application = express();
const PORT = Config.port || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const agendaa = new Agenda({ 
  db: { 
    address: config.dbUrl, 
  },
});
app.use("/admin/queue", Agendash(agendaa));

app.use('/api/v1', routes);
app.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError(req.path)));
app.use(ErrorHandler.handle());


let server: http.Server;
const startServer = async () => {
  const database = new Database();
  try {
    await database.initDatabase();
    await agenda.start();
    server = app.listen(PORT, (): void => {
      console.log(`Connected successfully on port ${PORT}`);
    });
  } catch (error: any) {
    console.error(`Error occurred: ${error.message}`);
  }
};

startServer();

ErrorHandler.initializeUnhandledException();

process.on('SIGTERM', () => {
  console.info('SIGTERM received');
  if (server) server.close();
});
