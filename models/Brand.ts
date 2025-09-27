import mongoose from 'mongoose';

const { Schema } = mongoose;

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    src: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
  },

  { versionKey: false, timestamps: true }
);

BrandSchema.index({ '$**': 'text' });

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
