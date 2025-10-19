import mongoose from 'mongoose';

const { Schema } = mongoose;

const leadSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  status: { type: String, enum: ['new', 'processed'], default: 'new' },
  convertedToCustomer: { type: Boolean, default: false },
});

leadSchema.index({ '$**': 'text' });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
