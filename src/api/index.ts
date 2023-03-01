import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import agendash from './routes/agendash';
import customer from './routes/customer';
import post from './routes/post';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	customer(app); 
	post(app);
	agendash(app);
	return app
}