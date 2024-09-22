import express from "express";
import { protectedRoute } from "../middleware/protected.middleware.js";
import {
  commentOnPost,
  createPost,
  deleteComment,
  deletePost,
  getFollowingPosts,
  getLikedPosts,
  getMyPosts,
  getPosts,
  getUserPosts,
  likeDislike,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createPost", protectedRoute, createPost);
router.delete("/:id", protectedRoute, deletePost);
router.post("/updatePost/:id", protectedRoute, updatePost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.delete(
  "/:postId/deleteComment/:commentId",
  protectedRoute,
  deleteComment
);
router.post("/likeDislike/:id", protectedRoute, likeDislike),
router.get("/getPosts", protectedRoute, getPosts);
router.get("/getMyPosts", protectedRoute, getMyPosts);
router.get("/follwingPosts", protectedRoute, getFollowingPosts);
router.get("/userPosts/:username", protectedRoute, getUserPosts);
router.get("/likedPosts", protectedRoute, getLikedPosts);
export default router;
