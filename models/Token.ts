import mongoose, { Document, HydratedDocument, Schema, Types } from 'mongoose';

export enum TokenType {
  REFRESH = 'REFRESH',
  VERIFICATION = 'VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_CHANGE = 'EMAIL_CHANGE',
}

export interface IToken extends Document {
  userId: Types.ObjectId;
  email?: string;
  token: string;
  type: TokenType;
  used: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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
    expiresAt: { type: Date },
  },
  { timestamps: true, autoIndex: false }
);

export type TokenDocument = HydratedDocument<IToken>;

export default mongoose.models.Token ||
  mongoose.model<IToken>('Token', TokenSchema);
