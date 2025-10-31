// models/User.ts
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { UserRole } from '@/types/IUser';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ '$**': 'text' });

userSchema.methods.setPassword = function (password: string) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
