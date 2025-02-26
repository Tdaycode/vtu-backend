import { Document, ObjectId } from 'mongoose';

export interface IKYCUpload {
  userId: ObjectId,
  rejectionReason?: string,
  status: KYCStatus,
  documents: KYCUploadDocument[]
}

export interface KYCUploadDocument {
  type: KYCDocumentTypes,
  url: string
}

export enum KYCDocumentTypes {
  PROOF_OF_ADDRESS = 'proof-of-address',
  USER_ID = 'user-id',
  SELFIE_WITH_USER_ID = 'selfie-user-id',
}

export enum KYCStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum KYCAction {
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface IKYCUploadDocument extends IKYCUpload, Document { }

