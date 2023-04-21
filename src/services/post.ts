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

      const posts = await this.postsModel.find(dbQuery).sort({ _id: -1 }).skip(skip).limit(limit);
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
      let post = await this.postsModel.findOne({ _id: mongoose.Types.ObjectId(input.id) });
      this.logger.info('post details response from DB %o', post);
      await this.postsModel.updateOne({ _id: mongoose.Types.ObjectId(input.id) }, { views: post.views + 1 });

      post = await this.postsModel.findOne({ _id: mongoose.Types.ObjectId(input.id) });
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
      const postExists = await this.postsModel.findOne({ _id: mongoose.Types.ObjectId(data.postId) });
      this.logger.debug('post exists in DB response %o', isCommentExists);

      const comments = [
        {
          commentedBy: {
            name: currentUser.name,
            userId: currentUser._id,
            image: currentUser.image || null,
            isPaid: currentUser?.isPaid
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
      const updatePost = {
        totalAnswers: postExists.totalAnswers + 1,
        views: postExists.views + 1,
      };
      await this.postsModel.updateOne({ _id: mongoose.Types.ObjectId(data.postId) }, { $set: updatePost });
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

  public async addPost(input: { currentUser: any; body: any }) {
    try {
      this.logger.info('Add Post service starts here %o', input);
      const data = input.body;
      const currentUser = input.currentUser;
      const dbQuery = {
        postedBy: {
          name: currentUser.name,
          userImage: currentUser.image || null,
          userId: currentUser._id,
          isPaid: currentUser?.isPaid
        },
        crop: {
          cropName: data?.crop?.cropName,
          cropId: data?.crop?.cropId,
          cropImage: data?.crop?.cropImage,
        },
        description: data.description,
        image: data?.image || null,
      };
      const postAdded = await this.postsModel.create(dbQuery);
      this.logger.debug('Post added in DB %o', postAdded);
      return postAdded;
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('List posts service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('List posts service end with error %o', err);
        throw new ErrorHandler.BadError('Add Post API Error');
      }
    }
  }

  public async updatePost(input: { postId: string; query: any }) {
    try {
      this.logger.info('Update Post Service starts here %o %o', input.postId, input.query);
      const post = await this.postsModel.findOne({ _id: mongoose.Types.ObjectId(input.postId) });
      let dbQuery: { likes?: number } = {};
      if (input.query.hasOwnProperty('like')) {
        dbQuery.likes = post.likes + 1;
      }
      await this.postsModel.updateOne({ _id: mongoose.Types.ObjectId(input.postId) }, { $set: dbQuery });
      return {
        ...input.query
      }
    } catch (err) {}
  }
}
