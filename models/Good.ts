import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';

export interface IGoodDB {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  src: string[];
  category: Types.ObjectId;
  brand: Types.ObjectId;
  model: string;
  sku: string;
  isUsed: boolean;
  isAvailable: boolean;
  isDailyDeal: boolean;
  isCompatible: boolean;
  compatibleGoods: Types.ObjectId[];
  averageRating?: number;
  ratingCount?: number;
  dealExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Схема ---
const GoodSchema = new Schema<IGoodDB>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    src: { type: [String], default: [] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    model: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    isUsed: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    isDailyDeal: { type: Boolean, default: false },
    isCompatible: { type: Boolean, default: false },
    compatibleGoods: [{ type: Schema.Types.ObjectId, ref: 'Good' }],
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    dealExpiresAt: { type: String },
  },
  { timestamps: true }
);

// --- Тип документа ---
export type GoodDocument = HydratedDocument<IGoodDB>;

// --- Модель ---
const Good =
  mongoose.models.Good || mongoose.model<IGoodDB>('Good', GoodSchema);

export default Good;
