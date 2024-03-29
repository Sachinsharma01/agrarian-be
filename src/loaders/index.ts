import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import jobsLoader from './jobs';
import Logger from './logger';
//We have to import at least all the events once so they can be triggered
import './events';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  const userModel = {
    name: 'userModel',
    // Notice the require syntax and the '.default'
    model: require('../models/user').default,
  };

  const postsModel = {
    name: 'postsModel',
    model: require('../models/post').default
  }
  
  const commentsModel = {
    name: 'commentsModel',
    model: require('../models/postComment').default
  }

  const cropsModel = {
    name: 'cropsModel',
    model: require('../models/crop').default
  }

  const userCropsModel = {
    name: 'userCropsModel',
    model: require('../models/userCrops').default
  }

  const cropDetailsModel = {
    name: 'cropDetailsModel',
    model: require('../models/cropdetails').default
  }

  const notificationModel = {
    name: 'notificationModel',
    model: require('../models/notification').default
  }

  // It returns the agenda instance because it's needed in the subsequent loaders
  const { agenda } = await dependencyInjectorLoader({
    mongoConnection,
    models: [
      userModel,
      postsModel,
      commentsModel,
      cropsModel,
      userCropsModel,
      cropDetailsModel,
      notificationModel,
      // salaryModel,
      // whateverModel
    ],
  });
  Logger.info('✌️ Dependency Injector loaded');

  await jobsLoader({ agenda });
  Logger.info('✌️ Jobs loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
