import express from 'express';
import { getUserInfo, loginUser, logoutUser } from './authService';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', loginUser);

router.get('/logout', loginUser);

router.get('/info', authenticate, getUserInfo);