import express from 'express';
import { getMeHandler, getUsers } from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

router.use(deserializeUser, requireUser);


router.get('/me', getMeHandler);

router.get('/users', getUsers);

export default router;

