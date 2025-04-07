import mongoose from "mongoose"
const { Schema } = mongoose

const testimonialsSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Good",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false, timestamps: true }
)

testimonialsSchema.index({ "$**": "text" })

const Testimonials =
  mongoose.models.Testimonials || mongoose.model("Testimonials", testimonialsSchema)

export default Testimonials
