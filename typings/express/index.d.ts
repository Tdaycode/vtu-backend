import { IUserDocument, IUser, IUSerIdentity } from '../../src/interfaces/user.interface';
export {}

declare global {
  namespace Express {
    export interface Request {
      user: Record<IUserDocument>;
      identity: IUSerIdentity;
    }
  }
}