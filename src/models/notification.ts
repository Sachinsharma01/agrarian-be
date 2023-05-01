import mongoose from 'mongoose';
import { INotification } from '../interfaces/INotification';

const Notification = new mongoose.Schema(
  {
    content: {
      type: String,
      default: '',
    },
    description : {
      type: String,
      default: ""
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    read: {
      type: Boolean,
      default: false,
    },
    notificationId: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<INotification & mongoose.Document>('Notification', Notification);
