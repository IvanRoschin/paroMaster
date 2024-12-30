import mongoose from "mongoose"

const { Schema } = mongoose

const lidSchema = new Schema(
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
    }
  },

  { versionKey: false, timestamps: true }
)

lidSchema.index({ "$**": "text" })

export default mongoose.models.Lid || mongoose.model("Lid", lidSchema)
