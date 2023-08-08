import { onValue, ref } from 'firebase/database';
import firebase from '../config/firebase';
import logger from '../loaders/logger';

export default {
  getFirebaseRealTimeData: async (key: string): Promise<String> => {
    let data: string;
    const dbRef: any = ref(firebase.db, key);
    onValue(dbRef, (snap: any) => {
      logger.debug(`${key} Data %o`, snap.val());
      data = snap.val();
    });

    return data;
  },
};
