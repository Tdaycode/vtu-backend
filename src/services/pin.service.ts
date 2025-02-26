import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import config from '../config/Config';
import { BadRequestError } from '../utils/ApiError';


@Service()
export class PinService {
  #rounds = 8;

  constructor(rounds: number) {
    this.#rounds = rounds || this.#rounds;
  }

  async hash(pin: string) {
    if (!pin) throw new BadRequestError("Please provide a valid pin");
    return await bcrypt.hash(pin, this.#rounds);
  }

  static async check(pin: string, hash: string) {
    if (!pin) throw new BadRequestError("Please provide a valid pin");
    return await bcrypt.compare(pin, hash);
  }

  async checkConfirmationCode(confirmationCode: string | Buffer, hash: string) {
    if (!confirmationCode) throw Error("Provide a confirmation code");
    return await bcrypt.compare(confirmationCode, hash);
  }

  verifyToken(token: string) {
    if (!token) throw Error("Provide a confirmation code");
    const decoded =  jwt.verify(token, config.jwtSecret, function(err, decoded){
      if (err) throw Error("Retry again code expired")
      return decoded;
    });
    return decoded
  }
}