import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    surname: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
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
