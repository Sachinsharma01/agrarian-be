import mongoose from 'mongoose';
import { IUserCrops } from '../interfaces/IUserCrops';
const UserCrops = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    crop: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUserCrops & mongoose.Document>('UserCrops', UserCrops);
