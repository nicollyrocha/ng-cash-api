import express from 'express';
import { registerAccountHandler, registerUserHandler } from '../controllers/cadastro.controller';

const router = express.Router();


// Register user
router.post('/register', registerUserHandler)
router.post('/registeraccount', registerAccountHandler)



export default router;

