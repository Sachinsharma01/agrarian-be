import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: 9000 || parseInt(process.env.PORT, 10),

  env: process.env.ENV,

  logTailToken: process.env.LOGTAIL_TOKEN,
  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO || 'HS256',

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * Agenda.js stuff
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  /**
   * Agendash config
   */
  agendash: {
    user: 'agendash',
    password: '123456',
  },
  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
  /**
   * Mailgun email credentials
   */
  emails: {
    apiKey: process.env.MAILGUN_API_KEY,
    apiUsername: process.env.MAILGUN_USERNAME,
    domain: process.env.MAILGUN_DOMAIN,
  },

  twilio: {
    sendOtp: process.env.TWILIO_SEND_OTP_URL,
    verifyOtp: process.env.TWILIO_VERIFY_OTP_URL,
    templateId: process.env.TWILIO_TWMPLATE_ID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  },

  weather: {
    api: process.env.WEATHER_API,
    apiKey: process.env.WEATHER_API_KEY,
  },

  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    awsSecret: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
  },
  fast2sms: {
    apiKey: process.env.FAST2SMS_API,
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    dbURL: process.env.FIREBASE_DB_URL,
  },
};
