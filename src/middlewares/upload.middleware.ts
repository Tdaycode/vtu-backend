import { NextFunction, Request, Response } from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';
import { KYCDocumentTypes } from '../interfaces/kyc-upload.interface';
import { BadRequestError } from '../utils/ApiError';

const createMulterMiddleware = (): Multer => {
  // Create 'uploads' folder if it doesn't exist
  const uploadsFolder = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
  }

  // Configure Multer storage
  const storage = multer.diskStorage({
    destination: uploadsFolder,
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limitation
  });
};

const upload = createMulterMiddleware();

const uploadKYCDocument = (req: Request, res: Response, next: NextFunction) => {
  const fields = Object.values(KYCDocumentTypes).map((doc) => ({
    name: doc,
    maxCount: 1
  }));

  upload.fields(fields)(req, res, function (err: any) {
    console.log(err)
    if (err) throw new BadRequestError("Failed to upload assets");
    next();
  });
};


export { upload, uploadKYCDocument };