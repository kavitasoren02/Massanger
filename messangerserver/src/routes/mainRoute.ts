import express from 'express';
import UserController from '../users/UserController';
import AuthController from '../auth/authController';
import MessageController from '../messages/MessageController';
import NotificationController from "../notifications/NotificationController";
import { authenticate } from '../middleware/authMiddleware';
const router = express.Router();

router.use('/user', UserController);

router.use('/auth', AuthController);

router.use('/messages', authenticate, MessageController);

router.use('/notifications', authenticate, NotificationController);

export default router;