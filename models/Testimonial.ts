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
      required: false,
      default: null, // Set default to null if no rating is provided
      validate: {
        validator: function (v: null | number) {
          // Allow null or numbers between 1 and 5
          return v === null || (v >= 1 && v <= 5)
        },
        message: "Rating must be between 1 and 5, or null"
      }
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
  mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialsSchema)

export default Testimonials
