// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import config from './index';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.dbURL,
  projectId: 'npk-data-75ebe',
  storageBucket: 'npk-data-75ebe.appspot.com',
  messagingSenderId: '1033536032245',
  appId: '1:1033536032245:web:711784e81c9e9e65d664bc',
  measurementId: 'G-6Q676514VJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase(app);

export default { app, db };
