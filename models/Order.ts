import mongoose from "mongoose"
const { Schema } = mongoose

const orderSchema = new Schema(
  {
    number: {
      type: String,
      required: true
    },
    customer: {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      warehouse: {
        type: String,
        required: true
      },
      payment: {
        type: String,
        enum: ["Оплата після отримання", "Оплата на карту", "Рахунок для СПД"],
        required: true
      }
    },
    orderedGoods: [
      {
        id: {
          type: String
        },
        title: {
          type: String,
          required: true
        },
        brand: {
          type: String,
          required: true
        },
        model: {
          type: String,
          required: true
        },
        vendor: {
          type: String,
          required: true
        },
        quantity: {
          type: Number
        },
        src: {
          type: [String]
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Новий", "Опрацьовується", "Оплачено", "На відправку", "Закритий"],
      required: true
    }
  },
  { versionKey: false, timestamps: true }
)

orderSchema.index({ "$**": "text" })

export default mongoose.models.Order || mongoose.model("Order", orderSchema)
