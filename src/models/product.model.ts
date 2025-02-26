import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { PaymentOptions, PaymentTypes,  IProduct, ProductTypes, DiscountType, 
  DiscountAmountType, Providers, ServiceTypes, ServiceFeeType, ServiceFeeAmountType, IProductDocument } from '../interfaces/product.interface';
import { generateShortID } from '../utils/helpers';

// A Schema corresponding to the document interface.
const ProductSchema: Schema<IProduct> = new Schema(
  {
    sid: { type: String, index: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    serviceFeeType: { type: String, enum: ServiceFeeType, default: ServiceFeeType.Global },
    serviceFeeAmount: {
      type: { type: String, enum: ServiceFeeAmountType },
      value: { type: Number },
    },
    discountType: { type: String, enum: DiscountType, default: DiscountType.Global },
    discountAmount: {
      type: { type: String, enum: DiscountAmountType },
      value: { type: Number },
    },
    providers: [{
      name: { type: String, enum: Providers },
      serviceId: { type: String, enum: ServiceTypes },
      productId: { type: String },
      active: { type: Boolean },
    }],
    label: { type: String },
    minPrice: { type: String },
    maxPrice: { type: String },
    currency: { type: String, default: "NGN" },
    paymentOptions: { type: String, enum: PaymentOptions, default: PaymentOptions.Global },
    allowedPaymentOptions: [{ type: String, enum: PaymentTypes }, { min: 1 }], 
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    isAvailable: { type: Boolean, default: true },
    displayCountries: [{ type: String, required: true }, { min: 1 }],
    type: { type: String, enum: ProductTypes },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre('save', function (next) {
  this.sid = generateShortID();
  next();
});

ProductSchema.plugin(mongoosePaginate);
ProductSchema.index({ name : "text" });

// Product Model
const Product = model<IProduct>('Product', ProductSchema);

// create the paginated model
const PaginatedProduct = model<IProductDocument,
  mongoose.PaginateModel<IProductDocument>
>('Product', ProductSchema, 'products'); 

export { PaginatedProduct, Product };
