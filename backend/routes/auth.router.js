import express from 'express';
import {  authLogin, authLogout, authSignup, getMe } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protected.middleware.js';

const router = express.Router();


router.get('/me',protectedRoute,getMe)
router.post('/signup',authSignup);
router.post('/login',authLogin);
router.post('/logout',authLogout);

export default router;