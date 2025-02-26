import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ICowry, ICowryDocument } from '../interfaces/cowry.interface';
import bcrypt from 'bcrypt';
import { hashPassword } from '../utils/crypto';

// A Schema corresponding to the document interface.
const cowrySchema: Schema<ICowry> = new Schema(
  {
    buyerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    loaderId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      default: null
    },
    code: {
      type: String,
      required: true,
      unique: true,
      minlength: 16,
      maxlength: 16
    }, 
    pin: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6
    },
    value: {
      type: Number,
      required: true
    },
    isValid: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  },
);

// Check if pin matches the user's pin
cowrySchema.methods.isPinMatch = async function (pin: string) {
  return bcrypt.compare(pin, this.pin);
};

// Hash pin before save
cowrySchema.pre('save', async function (next) {
  if (this.isModified('pin')) {
    this.pin = await hashPassword(this.pin);
  }
  next();
});

cowrySchema.plugin(mongoosePaginate);

// Cowry Model
const Cowry = model<ICowryDocument>('Cowry', cowrySchema);

// create the paginated model
const PaginatedCowry = model<ICowryDocument,
  mongoose.PaginateModel<ICowryDocument>
>('Cowry', cowrySchema, 'cowries');

export { Cowry, PaginatedCowry };