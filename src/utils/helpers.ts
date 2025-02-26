import orderId from 'order-id'
import cloudinary from 'cloudinary';
import fs from 'fs';
import config from '../config/Config';
import { generateFromEmail } from "unique-username-generator";
import ShortUniqueId from 'short-unique-id';
import { KYCDocumentTypes } from '../interfaces/kyc-upload.interface';

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

export const capitalizeWord = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const capitalizeWithUnderscore = (name: string) => {
  return name
    .split('_')
    .map((word) => capitalizeWord(word))
    .join(' ');
};

export const transformTVPackage = (name: string, month?: number) => {
  const packageName = capitalizeWithUnderscore(name);
  if(!month) return packageName;
  return `${packageName} - ${month} Month${month > 1 ? 's' : "" }`;
};

export const responseType = {
  body: 'body',
  query: 'query',
  params: 'params',
  headers: 'headers'
}

export interface UploadedFile {
  type: KYCDocumentTypes;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export const convertUploadedFiles = (input: any): UploadedFile[] => {
  const output: UploadedFile[] = [];

  for (const type in input) {
    const files = input[type];
    files.forEach((file: any) => {
      const convertedFile: UploadedFile = {
        ...file, type
      };
      output.push(convertedFile);
    });
  }

  return output;
}

export async function uploadFile(filePath: string) {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, { resource_type: "auto" });
    return result.url;
  } catch (error: any) {
    throw Error(error);
  }
}

export const removeFiles = (files: any) => {
  const filesArray = Object.values(files);
  filesArray.forEach((docs: any) => {
    docs.forEach((file: { path: fs.PathLike; }) => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Failed to remove file: ${file.path}`, err);
        } else {
          console.log(`File removed: ${file.path}`);
        }
      });
    });
  });
}
