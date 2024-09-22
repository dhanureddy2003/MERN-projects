import express from "express";
import { protectedRoute } from "../middleware/protected.middleware.js";
import {
  deleteNotification,
  deleteOneNotification,
  getNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/getNotifications", protectedRoute, getNotifications);
router.get("/deleteNotification", protectedRoute, deleteNotification);
router.delete("/deleteOneNotification/:id", protectedRoute, deleteOneNotification);

export default router;
