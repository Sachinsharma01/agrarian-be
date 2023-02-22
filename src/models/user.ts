import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    password: {
      type: String
    },
    crops: {
      type: [],
      default: [],
    },
    phone: {
      type: String
    },
    address:{
      type: String,
      default: ""
    },
    pincode: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
    otp: {
      type: Number
    },
    image: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      default: "farmer"
    }
  },
  { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
