import { Notification } from "../models/notification.model.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "from",
        select: "profileImg username",
      });
    await Notification.updateMany({ to: userId }, { read: true });
    if (notifications === 0) return res.status(200).json([]);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ "error in fetching notifications": error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Notification.deleteMany({ to: userId });
    res.status(200).json({ "notifications deleted successfully": result });
  } catch (error) {
    res.status(500).json({ "error in deleting notifications": error.message });
  }
};

const deleteOneNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      to: userId,
    });
    if (!notification) {
      return res.status(200).json({ error: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ "error in deleting notification": error.message });
  }
};

export { getNotifications, deleteNotification, deleteOneNotification };
