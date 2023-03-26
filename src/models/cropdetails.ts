import mongoose from 'mongoose';
import { ICropDetails } from '../interfaces/ICropDetails';

const CropDetails = new mongoose.Schema(
  {
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    key: {
      type: String,
    },
    pdfLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICropDetails & mongoose.Document>('CropDetails', CropDetails);
