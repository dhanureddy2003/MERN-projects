import express from "express";
import {
  followUnfollowUser,
  getUserProfile,
  searchUser,
  suggestedProfiles,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/protected.middleware.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.get("/suggestions", protectedRoute, suggestedProfiles);
router.post("/followUnfollow/:id", protectedRoute, followUnfollowUser);
router.post("/update", protectedRoute, updateProfile);
router.get("/search", protectedRoute, searchUser);
export default router;
