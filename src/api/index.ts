import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import agendash from './routes/agendash';
import customer from './routes/customer';
import post from './routes/post';
import crops from './routes/crops';
import home from './routes/home';
import notification from './routes/notification';
import firebase from './routes/firebase';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	customer(app); 
	post(app);
	crops(app);
	home(app);
	notification(app);
	agendash(app);
	firebase(app);
	return app
}