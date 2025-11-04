import mongoose, { Document, Schema, Types } from 'mongoose';

export enum TokenType {
  REFRESH = 'REFRESH',
  VERIFICATION = 'VERIFICATION',
}

export interface IToken extends Document {
  userId?: Types.ObjectId;
  email?: string;
  token: string;
  type: TokenType;
  used?: boolean;
  createdAt: Date;
}

const TokenSchema = new Schema<IToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String },
    token: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(TokenType),
      required: true,
      default: TokenType.REFRESH,
    },
    used: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    autoIndex: false,
  }
);

// TTL индекс для refresh токенов (30 дней)
TokenSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 30,
    partialFilterExpression: { type: TokenType.REFRESH },
  }
);

// TTL индекс для verification токенов (1 день)
TokenSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24,
    partialFilterExpression: { type: TokenType.VERIFICATION },
  }
);

export default mongoose.models.Token ||
  mongoose.model<IToken>('Token', TokenSchema);
