import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IKYCUpload, KYCStatus, KYCDocumentTypes } from '../interfaces/kyc-upload.interface';

// A Schema corresponding to the document interface.
const kycUploadSchema: Schema<IKYCUpload> = new Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    documents: [
      {
        type: { type: String, required: true, enum: KYCDocumentTypes },
        url: { type: String, required: true },
      }
    ],
    status: {
      type: String,
      enum: KYCStatus,
      default: KYCStatus.Pending
    },
    rejectionReason: { type: String },
  },
  {
    timestamps: true,
  },
);

kycUploadSchema.plugin(mongoosePaginate);

// KYCUpload Model
const KYCUpload = model<IKYCUpload>('KYCUpload', kycUploadSchema);

// create the paginated model
const PaginatedKycUpload = model<IKYCUpload,
  mongoose.PaginateModel<IKYCUpload>
>('KYCUpload', kycUploadSchema, 'kycuploads'); 

export { KYCUpload, PaginatedKycUpload };
