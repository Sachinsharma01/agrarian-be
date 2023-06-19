import { Logger } from 'winston';
import mongoose from 'mongoose';
import { Container } from 'typedi';
import { IPost } from '@/interfaces/IPost';
import PostsModel from '../../models/post';

const isAuthorizedToDeletePost = async (req, res, next) => {
  const Logger: Logger = Container.get('logger');
  Container.set('postsModel', PostsModel);
  try {
    const PostModel = Container.get('postModel') as mongoose.Model<IPost & mongoose.Document>;
    const postRecord = await PostModel.findOne({ _id: mongoose.Types.ObjectId(req.params.postId) });
    if (!postRecord) {
      return res.sendStatus(401);
    }
    const currentUser = req.currentUser;
    if (postRecord['postedBy.userId'] !== currentUser._id) {
      return res.sendStatus(401);
    }
    return next();
  } catch (err) {
    Logger.error('🔥 Error validation authorization user : %o', err);
    return next(err);
  }
};

export default isAuthorizedToDeletePost;
