// models/Customer.ts
import mongoose, { HydratedDocument, Model } from 'mongoose';

import { ICustomer } from '@/types/ICustomer';
import { PaymentMethod } from '@/types/paymentMethod';

const { Schema } = mongoose;

type CustomerModel = Model<ICustomer>;

const customerSchema = new Schema<ICustomer>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    city: { type: String, required: true },
    warehouse: { type: String, required: true },
    payment: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Good', default: [] }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order', default: [] }],
  },
  { timestamps: true, versionKey: false }
);

export type CustomerDocument = HydratedDocument<ICustomer>;

export default (mongoose.models.Customer as CustomerModel) ||
  mongoose.model<ICustomer, CustomerModel>('Customer', customerSchema);
