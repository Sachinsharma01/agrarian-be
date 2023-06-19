import AWS from 'aws-sdk';
import logger from '../loaders/logger';
import ErrorHandler from '../utility/errors';
import config from '../config';

AWS.config.update({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.awsSecret,
  region: config.aws.region,
});
const SNS = new AWS.SNS();
SNS.setSMSAttributes({
  attributes: { DefaultSMSType: 'Transactional' },
});

const sendSMS = async (input: any) => {
  try {
    logger.info('signedUrl starts here %o', input);
    const params: any = {
      Message: 'Welcome to Agrarian',
      MessageStructure: 'string',
      PhoneNumber: '8077907499',
    };
    SNS.publish(params, function (err, data) {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Success', data.MessageId);
      }
    });

    return 'success';
  } catch (err) {
    logger.error('get signed url end with error %o', err);
    throw new ErrorHandler.BadError('Get signed URL Error');
  }
};

export default { sendSMS };
