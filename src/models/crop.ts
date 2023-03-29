import mongoose from 'mongoose';
import { ICrop } from '../interfaces/ICrop';
const Crop = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
      default: '',
    },
    totalWeeks: {
      type: Number,
      default: 2
    }
  },
  { timestamps: true },
);

export default mongoose.model<ICrop & mongoose.Document>('Crop', Crop);