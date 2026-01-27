import express from 'express';
import UserController from '../users/UserController';
import AuthController from '../auth/authController';
const router = express.Router();

router.use('/user', UserController);

router.use('/auth', AuthController);

export default router;