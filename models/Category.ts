import mongoose from "mongoose"

const { Schema } = mongoose

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  },

  { versionKey: false, timestamps: true }
)

CategorySchema.index({ "$**": "text" })

export default mongoose.models.Category || mongoose.model("Category", CategorySchema)
