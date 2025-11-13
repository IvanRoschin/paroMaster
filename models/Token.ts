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
  refreshCreatedAt?: Date;
  verificationCreatedAt?: Date;
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

// TTL для REFRESH токенов (30 дней)
TokenSchema.index(
  { refreshCreatedAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 30,
    partialFilterExpression: { type: TokenType.REFRESH },
  }
);

// TTL для VERIFICATION токенов (1 день)
TokenSchema.index(
  { verificationCreatedAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24,
    partialFilterExpression: { type: TokenType.VERIFICATION },
  }
);

export default mongoose.models.Token ||
  mongoose.model<IToken>('Token', TokenSchema);
