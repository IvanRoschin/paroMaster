import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    number: {
      type: String,
      required: true,
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      warehouse: {
        type: String,
        required: true,
      },
      payment: {
        type: String,
        required: true,
      },
    },
    orderedGoods: [
      {
        _id: {
          type: String,
          ref: 'Good',
        },
        title: {
          type: String,
          required: true,
        },
        brand: {
          type: String,
          required: true,
        },
        model: {
          type: String,
          required: true,
        },
        sku: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
        },
        src: {
          type: [String],
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Новий', 'Опрацьовується', 'Оплачено', 'На відправку', 'Закритий'],
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

orderSchema.index({ '$**': 'text' });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
