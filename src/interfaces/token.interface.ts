import { Types } from 'mongoose';

export interface IToken {
  token: string;
  type: string;
  expires: Date;
  user?: Types.ObjectId;
}

export interface IAuthTokens {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}

export enum TokenTypes {
  Refresh = 'refresh',
  Access = 'access',
  PrimeAirtime = 'primeairtime',
  Interswitch = 'interswitch',
  Giftly = 'giftly',
  Kuda = 'kuda',
}
