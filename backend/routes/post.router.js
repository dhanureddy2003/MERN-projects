import express from 'express';
import { protectedRoute } from '../middleware/protected.middleware.js';
import { commentOnPost, createPost, deletePost, getFollowingPosts, getPosts, getUserPosts, likeDislike, updatePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/createPost',protectedRoute,createPost);
router.delete('/:id',protectedRoute,deletePost)
router.post('/updatePost/:id',protectedRoute,updatePost)
router.post('/comment/:id',protectedRoute,commentOnPost)
router.post('/likeDislike/:id',protectedRoute,likeDislike),
router.get('/getPosts',protectedRoute,getPosts)
router.get('/follwingPosts',protectedRoute,getFollowingPosts)
router.get('/userPosts/:username',protectedRoute,getUserPosts)
export default router;