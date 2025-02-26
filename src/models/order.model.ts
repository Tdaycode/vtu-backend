import mongoose, { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IOrder, OrderStatus, IOrderDocument } from '../interfaces/order.interface';

// A Schema corresponding to the document interface.
const orderSchema: Schema<IOrder> = new Schema(
  {
    orderNumber: { type: String, required: true },
    reference: { type: String },
    orderStatusMessage: { type: String },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    }, 
    product: {
      id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
        required: true
      },
      externalId: { type: String, required: true },
      name: { type: String },
      provider: { type: String },
      imageUrl: { type: String },
      type: { type: String },
      amount: { type: Number }
    },
    status: {
        type: String,
        enum: OrderStatus,
        default: OrderStatus.Pending
    },
    prepaid: { type: Boolean },
    currency: { type: String, default: "NGN" },
    additionalInfo: { type: Object, default: {}},
    recipient: { type: String, required: true },
    amount: { type: Number, required: true },
    amountUSD: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(mongoosePaginate);
orderSchema.index({ orderNumber : "text" });

// Order Model
const Order = model<IOrder>('Order', orderSchema); 

// create the paginated model
const PaginatedOrder = model<IOrderDocument,
  mongoose.PaginateModel<IOrderDocument>
>('Order', orderSchema, 'orders');

export { Order, PaginatedOrder };
