import orderId from 'order-id'
import config from '../config/Config';
import { generateFromEmail } from "unique-username-generator";
import ShortUniqueId from 'short-unique-id';

interface ObjectWithKey {
    [key: string]: any;
  }
  
export function mergeArraysByKey(
    arr1: ObjectWithKey[],
    arr2: ObjectWithKey[],
    key: keyof ObjectWithKey
  ): ObjectWithKey[] {
    const lookup: Record<string, ObjectWithKey> = {};
    const result: ObjectWithKey[] = [];
  
    // build lookup object using key
    for (const item of arr1) {
      lookup[item[key].toString()] = item;
    }
  
    for (const item of arr2) {
      const itemId = item[key].toString();
      const lookupItem = lookup[itemId];
      if (lookupItem) {
        // merge objects with the same key
        const mergedObject = { ...lookupItem, ...item } as ObjectWithKey;
        result.push(mergedObject);
      } else {
        result.push(item);
      }
    }
  
    return result;
}

export const generateOrderNumber = () => {
  const orderid = orderId(config.cryptoSecret);
  const orderNumber = orderid.generate();
  return "GC-" + orderNumber;
};

export const generateUserName = (email: string) => {
  const username = generateFromEmail(email, 3);
  return username;
};

export const generateShortID = () => {
  const uid = new ShortUniqueId({
    dictionary: 'number',
    length: 6
  });

  return uid().toString();
};

export const generateCowryVoucherCode = () => {
  const uid = new ShortUniqueId({
    dictionary: 'alphanum_upper',
    length: 16
  });

  return uid().toString();
};

export const dataConversion = (amount: string, validity: string) => {
    let dataAmount = parseInt(amount);
    let dataUnit = 'MB';
  
    if (dataAmount >= 1000) {
      dataAmount /= 1000;
      dataUnit = 'GB';
    }
  
    if (dataAmount >= 1000) {
      dataAmount /= 1000;
      dataUnit = 'TB';
    }
  
    const name = `${dataAmount}${dataUnit} ${validity}`;
    return removeNameDuplicates(name);
};

export const removeNameDuplicates = (name: string) => {
  const words = name.split(' ');
  const uniqueWords = Array.from(new Set(words));
  const uniqueName = uniqueWords.join(' ');
  return uniqueName;
}

export const responseType = {
  body: 'body',
  query: 'query',
  params: 'params',
  headers: 'headers'
}