import bcrypt from 'bcryptjs';
import mongoose, { Model } from 'mongoose';

import { IUser, UserRole } from '@/types/IUser';

export interface IUserMethods {
  setPassword(password: string): void;
  comparePassword(password: string): boolean;
}

type UserModel = Model<IUser, {}, IUserMethods>;
export type UserDocument = mongoose.HydratedDocument<IUser, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: false },
  password: { type: String },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER,
  },
  googleId: { type: String, unique: true, sparse: true },
  isActive: { type: Boolean, default: false },
});

userSchema.methods.setPassword = function (password: string) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password: string) {
  if (!this.password) return false;
  return bcrypt.compareSync(password, this.password);
};

export default (mongoose.models.User as UserModel) ||
  mongoose.model<IUser, UserModel>('User', userSchema);
