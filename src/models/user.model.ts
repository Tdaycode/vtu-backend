import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';
import { IUserModel, IUserDocument, TwoFATypes, AccountType, AccountStatus } from '../interfaces/user.interface';
import { hashPassword } from '../utils/crypto';
import { generateUserName } from '../utils/helpers';

// A Schema corresponding to the document interface.
const userSchema: Schema<IUserDocument> = new Schema(
  {
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, unique: true },
    cowryBalance: { type: Number, default: 0 },
    mainBalance: { type: Number, default: 0 },
    bankInfo: {
      bankName: { type: String },
      accountNumber: { type: String },
    },
    phoneNumber: { type: String, required: true },
    country: { type: String, required: true },
    currency: { type: String, required: true },
    password: { type: String, required: true },
    firstLogin: { type: Boolean, default: true },
    pin: { type: String, default: null },
    identityHash: { type: String },
    imageURL: { type: String },
    dob: { type: Date },
    accountType: {
      type: String,
      default: AccountType.USER,
      enum: AccountType
    },
    accountStatus: {
      type: String,
      default: AccountStatus.ACTIVE,
      enum: AccountStatus
    },
    isIdentityVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isSpendingEnabled: { type: Boolean, default: true },
    isPhoneVerified: { type: Boolean, default: false },
    identityData: { type: Object },
    kycLevel: { type: mongoose.SchemaTypes.ObjectId, ref: 'KYCLevel' },
    twoFA: {
      needed: {
        type: Boolean,
        default: false,
      },
      enabled: {
        type: Boolean,
        default: true,
      },
      type: {
        type: String,
        trim: true,
        enum: [TwoFATypes.email, TwoFATypes.totp],
        default: TwoFATypes.email,
      },
      totpSecret: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Check if email is taken
userSchema.statics.isEmailTaken = async function (email: string) {
  const user = await this.findOne({ email });
  return !!user;
};

// Check if password matches the user's password
userSchema.methods.isPasswordMatch = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Hash password before save
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
    this.userName = generateUserName(this.email);
  }
  next();
});

userSchema.plugin(mongoosePaginate);
userSchema.index({ firstName : "text", lastName: "text", email: "text" });

// User Model
const User = model<IUserDocument, IUserModel>('User', userSchema);

// create the paginated model
const PaginatedUser = model<IUserDocument,
  mongoose.PaginateModel<IUserDocument>
>('User', userSchema, 'users'); 

export { User, PaginatedUser };
