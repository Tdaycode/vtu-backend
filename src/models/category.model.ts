import { Schema, model } from 'mongoose';
import { ICategory } from '../interfaces/category.interface';
import { generateShortID } from '../utils/helpers';

// A Schema corresponding to the document interface.
const categorySchema: Schema<ICategory> = new Schema(
  {
    sid: { type: String, index: true, unique: true },
    name: { type: String, unique: true, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  },
);

categorySchema.pre('save', function (next) {
  this.sid = generateShortID();
  next();
});

// Category Model
const Category = model<ICategory>('Category', categorySchema);

export default Category;
