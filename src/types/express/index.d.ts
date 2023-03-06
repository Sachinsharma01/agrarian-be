import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IPost } from '@/interfaces/IPost';
import { IComments } from '@/interfaces/IComments';
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
  }
}
