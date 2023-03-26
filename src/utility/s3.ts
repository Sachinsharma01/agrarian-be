import AWS from 'aws-sdk';
import logger from '../loaders/logger';
import ErrorHandler from '../utility/errors';
import config from '../config';

const signedUrl = async (input: string) => {
  try {
    logger.info('signedUrl starts here %o', input);
    AWS.config.update({
      accessKeyId: config.aws.accessKey,
      secretAccessKey: config.aws.awsSecret,
      region: config.aws.region,
    });
    const S3 = new AWS.S3();
    const params = {
      Bucket: 'agrarian-dev',
      Key: `${input}`,
      Expires: 60 * 60 * 60,
    };
    const signedURl = await S3.getSignedUrl('getObject', params);
    logger.info('signed url %o', signedURl);
    return signedURl;
  } catch (err) {
    logger.error('get signed url end with error %o', err);
    throw new ErrorHandler.BadError('Get signed URL Error');
  }
};

export default { signedUrl };
