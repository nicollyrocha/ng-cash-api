import express from 'express';
import { registerAccountHandler, registerUserHandler } from '../controllers/cadastro.controller';

const router = express.Router();


// Register user
router.post('/registeraccount', registerAccountHandler);
router.post('/register', registerUserHandler)



export default router;

