import crypto from 'crypto';
import bcrypt from 'bcrypt';
import config from '../config/Config';

const password = config.jwtSecret;
const iv = Buffer.from(config.cryptoSecret);
const ivstring = iv.toString('hex');

function sha1(input: string | Buffer) {
  return crypto.createHash('sha1').update(input).digest();
}

export function hashString(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

const password_derive_bytes = (password: string, salt: string, iterations: number, len: number) => {
  let key = Buffer.from(password + salt);
  for (let i = 0; i < iterations; i++) {
    key = sha1(key);
  }
  if (key.length < len) {
    const hx = password_derive_bytes(password, salt, iterations - 1, 20);
    for (let counter: any = 1; key.length < len; ++counter) {
      key = Buffer.concat([key, sha1(Buffer.concat([Buffer.from(counter.toString()), hx]))]);
    }
  }
  return Buffer.alloc(len, key);
};

export const encode = async (string: string) => {
  const key = password_derive_bytes(password, '', 100, 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, ivstring);
  const part1 = cipher.update(string, 'utf8');
  const part2 = cipher.final();
  const encrypted = Buffer.concat([part1, part2]).toString('base64');
  return encrypted;
};

export const decode = async (string: string) => {
  const key = password_derive_bytes(password, '', 100, 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivstring);
  let decrypted = decipher.update(string, 'base64', 'utf8');
  decrypted += decipher.final();
  return decrypted;
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 8);
}
