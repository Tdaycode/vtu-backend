import { connect, connection } from 'mongoose';
import config from './Config';

class Database {
  public async initDatabase(): Promise<void> {
    try {
      await connect(config.dbUrl);
      console.log('Database connected successfully');
    } catch (err) {
      console.error('Could not connect to db', err);
    }
  }

  public async disconnectDatabase(): Promise<void> {
    try {
      await connection.close();
      console.log('Database disconnected successfully');
    } catch (err) {
      console.error('Could not disconnect db', err);
    }
  }
}

export default Database;
