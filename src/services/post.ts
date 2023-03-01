import { Inject, Service } from 'typedi';
import ErrorHandler from '../utility/errors';
import { ERROR_CODES } from '../config/errors';

@Service()
export default class PostService {
  constructor(@Inject('postsModel') private postsModel: Models.PostsModel, @Inject('logger') private logger) {}

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

      input.query.userId ? dbQuery['posteBy.userId'] = input.query.userId : null;
      input.query.name ? dbQuery['name'] = input.query.name : null;
      input.query.cropName ? dbQuery['crop.cropName'] = input.query.cropName : null;

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
}
