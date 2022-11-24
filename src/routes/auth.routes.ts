import express from 'express';
import {
  loginUserHandler,
  logoutHandler,
  refreshAccessTokenHandler,
} from '../controllers/auth.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { createAccountSchema, createUserSchema, loginUserSchema } from '../schemas/users.schema';

const router = express.Router();






router.get('/logout', deserializeUser, requireUser, logoutHandler);


router.get('/refresh', refreshAccessTokenHandler);

export default router;

