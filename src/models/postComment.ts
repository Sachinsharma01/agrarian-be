import mongoose from 'mongoose';
import { IComments } from '../interfaces/IComments';
const Comment = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    comments: {
      type: [],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model<IComments & mongoose.Document>('Comment', Comment);
