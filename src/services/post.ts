import { Inject, Service } from 'typedi';
import ErrorHandler from '../utility/errors';
import { ERROR_CODES } from '../config/errors';
import mongoose from 'mongoose';

@Service()
export default class PostService {
  constructor(
    @Inject('postsModel') private postsModel: Models.PostsModel,
    @Inject('commentsModel') private commentsModel: Models.CommentsModel,
    @Inject('logger') private logger,
  ) {}

  public async listPosts(input: any) {
    try {
      this.logger.info('List posts service starts here %o', input.query);
      const currentUser = input.currentUser;
      const query: any = input.query;
      let dbQuery = {};

      const limit = query.limit ? query.limit : 0;
      delete query.limit;

      const page = query.page ? query.page : 1;
      delete query.page;

      const skip = limit * page;

      input.query.userId ? (dbQuery['postedBy.userId'] = input.query.userId) : null;
      input.query.name ? (dbQuery['name'] = input.query.name) : null;
      input.query.cropName ? (dbQuery['crop.cropName'] = input.query.cropName) : null;

      // dbQuery = {
      //   ...input.query,
      // };
      this.logger.info('list posts db query %o', dbQuery);

      const posts = await this.postsModel.find(dbQuery).skip(skip).limit(limit);
      this.logger.debug('list posts response from db %o', posts);
      return posts;
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('List posts service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('List posts service end with error %o', err);
        throw new ErrorHandler.BadError(ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGLP_DEF));
      }
    }
  }

  public async getPostDetails(input: { id: string }) {
    try {
      this.logger.debug('get post detail API start here %o', input);
      const post = await this.postsModel.findOne({ _id: mongoose.Types.ObjectId(input.id) });
      this.logger.info('post details response from DB %o', post);
      const comments = await this.commentsModel
        .findOne({ postId: mongoose.Types.ObjectId(input.id) })
        .sort({ _id: -1 });
      this.logger.info('post comments response from DB %o', comments);
      if (!post) {
        throw new ErrorHandler.BadError('The post you are looking for no longer exists!');
      }
      return {
        post,
        comments,
      };
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('post details and comment service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('post details and comment service end with error %o', err);
        throw new ErrorHandler.BadError(ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGPD_DEF));
      }
    }
  }

  public async addComment(input: any) {
    try {
      this.logger.info('Add comment service starts here %o', input);
      const data = input.body;
      const currentUser = input.currentUser;
      const isCommentExists = await this.commentsModel.findOne({ postId: data.postId });
      this.logger.debug('Comment exists in DB response %o', isCommentExists);
      const comments = [
        {
          commentedBy: {
            name: currentUser.name,
            userId: currentUser._id,
            image: currentUser.image || null,
          },
          comment: data.comment,
          commentedOn: new Date().toISOString(),
        },
      ];
      if (!isCommentExists) {
        this.logger.info('Add comment is not exists %o', comments);
        const dataObj = {
          postId: mongoose.Types.ObjectId(data.postId),
          comments: comments,
        };
        await this.commentsModel.create(dataObj);
      } else {
        await this.commentsModel.updateOne({ postId: mongoose.Types.ObjectId(data.postId) }, { $push: { comments } });
      }
      const comment = await this.commentsModel
        .findOne({ postId: mongoose.Types.ObjectId(data.postId) })
        .sort({ _id: -1 });
      this.logger.info('post comments response from DB %o', comments);
      return comment;
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('post details and comment service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('post details and comment service end with error %o', err);
        throw new ErrorHandler.BadError(ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGPD_DEF));
      }
    }
  }
}
