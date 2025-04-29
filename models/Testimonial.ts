import mongoose from "mongoose"
const { Schema } = mongoose

const testimonialsSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Good",
      required: false
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
      required: false,
      default: null,
      validate: {
        validator: function (v: null | number) {
          return v === null || (v >= 1 && v <= 5)
        },
        message: "Rating must be between 1 and 5, or null"
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { versionKey: false, timestamps: true }
)

testimonialsSchema.index({ "$**": "text" })

export default mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialsSchema)
