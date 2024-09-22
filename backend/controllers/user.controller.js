import { Notification } from "../models/notification.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select("-password")
      .populate({
        path: "posts",
      });

    if (!user) return res.status(404).json({ error: "user not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const searchUser = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("-password");
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(200).json({ error: "user not found" });

    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return res.status(200).json({ error: "No user found" });

    if (id === currentUser._id.toString()) {
      return res.status(200).json({ error: "Can't follow yourself" });
    }
    if (currentUser.following.includes(id)) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "unfollowed the user." });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findOneAndUpdate(req.user._id, { $push: { following: id } });

      res.status(200).json({ message: "followed the user." });
    }
    await user.save();

    const notification = new Notification({
      from: req.user._id,
      to: user._id,
      type: "follow",
    });
    await notification.save();
  } catch (error) {
    res.status(400).json({ error: "Cannot follow / unfollow profile" });
  }
};

const suggestedProfiles = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("following");
    const suggestedUsers = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);
    let filteredUsers = suggestedUsers.filter(
      (feild) => !user.following.includes(feild._id)
    );
    filteredUsers = filteredUsers.slice(0, 5);
    filteredUsers.forEach((feild) => {
      feild.password = null;
    });
    if (filteredUsers === 0) return res.status(404).json([]);
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    // password should be null in response
    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export {
  getUserProfile,
  followUnfollowUser,
  suggestedProfiles,
  updateProfile,
  searchUser,
};
