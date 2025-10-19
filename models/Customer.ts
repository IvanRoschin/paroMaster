import mongoose from 'mongoose';

import { paymentMethods } from '@/config/constants';

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    warehouse: { type: String, required: true },
    payment: {
      type: String,
      enum: paymentMethods.map(p => p.id),
    },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },

  { versionKey: false, timestamps: true }
);

customerSchema.index({ '$**': 'text' });

export default mongoose.models.Customer ||
  mongoose.model('Customer', customerSchema);
