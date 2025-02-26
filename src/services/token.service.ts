import { BadRequestError, NotFoundError } from '../utils/ApiError';
import { Service } from 'typedi';
import { LoggerClient } from './logger.service';
import Token from '../models/token.model';
import moment, { Moment } from 'moment';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IAuthTokens, TokenTypes } from '../interfaces/token.interface';
import config from '../config/Config';

const logger = new LoggerClient();

@Service()
export default class TokenService {
  // Method that generates JWT Token
  public static generateToken(userId: string, expires: Moment, type: TokenTypes, secret = config.jwtSecret): string {
    try {
      const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
      };
      return jwt.sign(payload, secret);
    } catch (error: any) {
      logger.error(error.message);
      throw new BadRequestError('An error occured');
    }
  }

  // Method that stores token in the database
  public static async saveToken(token: string, userId: string, expires: Moment, type: TokenTypes): Promise<void> {
    try {
      await Token.updateOne(
        { user: userId, type },
        {
          token,
          user: userId,
          expires: expires.toDate(),
          type,
        },
        { upsert: true },
      );
    } catch (error: any) {
      logger.error(error.message);
      throw new BadRequestError('An error occured');
    }
  }

  //  Method that verifies JWT Token
  public static verifyToken(token: string): JwtPayload | string {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      return payload;
    } catch (error) {
      console.log(error);
      throw new BadRequestError('An error occured');
    }
  }

  public static verifyRefreshToken = async (token: string) => {
    const payload = jwt.verify(token, config.jwtSecret);
    const tokenDoc = await Token.findOne({ token, type: TokenTypes.Refresh, user: payload.sub, blacklisted: false });
    if (!tokenDoc) {
      throw new BadRequestError('Token not found');
    }
    return tokenDoc;
  };

  // Method that generates access and refresh token
  public static async generateAuthTokens(user: any): Promise<IAuthTokens> {
    try {
      const accessTokenExpires = moment().add(user?.rememberMe ? 10080 : config.jwtAcessExpirationMinutes, 'minutes');
      const accessToken = this.generateToken(user._id, accessTokenExpires, TokenTypes.Access);

      const refreshTokenExpires = moment().add(config.jwtRefreshExpirationDays, 'days');
      const refreshToken = this.generateToken(user._id, refreshTokenExpires, TokenTypes.Refresh);
      await this.saveToken(refreshToken, user._id, refreshTokenExpires, TokenTypes.Refresh);

      return {
        access: {
          token: accessToken,
          expires: accessTokenExpires.toDate(),
        },
        refresh: {
          token: refreshToken,
          expires: refreshTokenExpires.toDate(),
        },
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestError('An error occured');
    }
  }

  public static async logout(refreshToken: string): Promise<void> {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: TokenTypes.Refresh });
    if (!refreshTokenDoc) {
      throw new NotFoundError('Not found');
    }
    await refreshTokenDoc.remove();
  }

  public static async storeToken(token: string, expires: Date, type: TokenTypes): Promise<void> {
    try {
      await Token.updateOne(
        { type },
        {
          token,
          expires,
          type,
        },
        { upsert: true },
      );
    } catch (error: any) {
      logger.error(error.message);
      throw new BadRequestError('An error occured');
    }
  }

  public static async retrieveToken(type: TokenTypes) {
    try {
      const token = await Token.findOne({ type });
      return token;
    } catch (error: any) {
      logger.error(error.message);
      throw new BadRequestError('An error occured');
    }
  }
}
