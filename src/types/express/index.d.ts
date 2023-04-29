import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IPost } from '@/interfaces/IPost';
import { IComments } from '@/interfaces/IComments';
import { ICrop } from '@/interfaces/ICrop';
import { IUserCrops } from '../../interfaces/IUserCrops';
import { ICropDetails } from '@/interfaces/ICropDetails';
import { INotification } from '@/interfaces/INotification';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type PostsModel = Model<IPost & Document>;
    export type CommentsModel = Model<IComments & Document>;
    export type CropModel = Model<ICrop & Document>;
    export type UserCropsModel = Model<IUserCrops & Document>;
    export type CropDetailsModel = Model<ICropDetails & Document>;
    export type NotificationModel = Model<INotification & Document>;
  }
}
