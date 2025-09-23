import mongoose from 'mongoose';

const { Schema } = mongoose;

const sliderSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    src: {
      type: [String],
      required: true,
      validate: [
        (arr: string[]) => arr.length > 0,
        'Щонайменше одне зображення обовʼязкове',
      ],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },

  { versionKey: false, timestamps: true }
);

sliderSchema.index({ '$**': 'text' });

export default mongoose.models.Slider || mongoose.model('Slider', sliderSchema);
