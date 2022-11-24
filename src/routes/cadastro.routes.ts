import express from 'express';
import { registerAccountHandler, registerUserHandler } from '../controllers/cadastro.controller';

const router = express.Router();



router.post('/registeraccount', registerAccountHandler);
router.post('/register', registerUserHandler)



export default router;

