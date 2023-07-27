import express from 'express';
import { signin, register } from '../controllers/auth.js';

const router = express.Router();

//CREATE A USER
router.post('/register', register);

// //SIGN IN
router.post('/signin', signin);

export default router;
