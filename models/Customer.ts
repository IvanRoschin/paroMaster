// models/Customer.ts
import mongoose from 'mongoose';

import { ICustomer } from '@/types/ICustomer';
import { PaymentMethod } from '@/types/paymentMethod';

const { Schema } = mongoose;

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
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order', default: [] }],
  },
  { timestamps: true, versionKey: false }
);

customerSchema.index({ '$**': 'text' });

export default mongoose.models.Customer ||
  mongoose.model('Customer', customerSchema);
