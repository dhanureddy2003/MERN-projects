import express from 'express';
import { followUnfollowUser, getUserProfile, suggestedProfiles,updateProfile } from '../controllers/user.controller.js';
import { protectedRoute } from '../middleware/protected.middleware.js';

const router = express.Router();

router.get('/Profile/:username',protectedRoute,getUserProfile);
router.get('/suggestions',protectedRoute, suggestedProfiles);
router.post('/followUnfollow/:id',protectedRoute,followUnfollowUser);
router.post('/update',protectedRoute,updateProfile);
export default router;