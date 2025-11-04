import mongoose from 'mongoose';

import { ICategory } from '../types';

const { Schema } = mongoose;

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
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
  },

  { versionKey: false, timestamps: true }
);

CategorySchema.index({ '$**': 'text' });

export default mongoose.models.Category ||
  mongoose.model('Category', CategorySchema);
