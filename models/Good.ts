import mongoose from "mongoose"
const { Schema } = mongoose

const goodSchema = new Schema(
  {
    category: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    src: {
      type: [String],
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
    price: {
      type: Number,
      required: true
    },
    isCondition: {
      type: Boolean,
      required: true
    },
    isAvailable: {
      type: Boolean,
      required: true
    },
    isCompatible: {
      type: Boolean,
      required: true
    },
    compatibility: {
      type: [String],
      default: []
    },
    averageRating: {
      type: Number
    },
    ratingCount: {
      type: Number
    }
  },
  { versionKey: false, timestamps: true }
)

goodSchema.index({ "$**": "text" })

export default mongoose.models.Good || mongoose.model("Good", goodSchema)
