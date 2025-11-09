import express from 'express';
import UserController from '../users/UserController';
const router = express.Router();

router.use('/user', UserController)

export default router;