import mongoose from 'mongoose';
import { IPost } from '../interfaces/IPost';
const Post = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    totalAnswers: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    answers: {
      type: [],
      default: [],
    },
    postedBy: {
      name: {
        type: String,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    tags: {
      type: [],
      default: [],
    },
    crop: {
      cropName: {
        type: String,
      },
      cropId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model<IPost & mongoose.Document>('Post', Post);
