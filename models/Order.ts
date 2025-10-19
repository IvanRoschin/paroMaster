import mongoose from 'mongoose';

import { orderStatus } from '@/config/constants';

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    number: {
      type: String,
      required: true,
    },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerSnapshot: {
      name: { type: String, required: true },
      surname: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      city: { type: String, required: true },
      warehouse: { type: String, required: true },
      payment: { type: String, required: true },
    },
    orderedGoods: [
      {
        good: { type: Schema.Types.ObjectId, ref: 'Good', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: orderStatus.map(s => s.id),
      default: 'NEW',
    },
  },

  { versionKey: false, timestamps: true }
);

orderSchema.index({ '$**': 'text' });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
