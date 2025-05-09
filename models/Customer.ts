import mongoose from "mongoose"

const { Schema } = mongoose

const customerSchema = new Schema(
  {
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
      required: true
    },
    orders: [{ type: Schema.Types.ObjectId, ref: "orders" }]
  },

  { versionKey: false, timestamps: true }
)

customerSchema.index({ "$**": "text" })

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema)
