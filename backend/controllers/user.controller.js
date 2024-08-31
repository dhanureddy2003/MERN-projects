import { Notification } from "../models/notification.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");

    if (!user) return res.status(404).json({ error: "user not found" });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "user not found" });

    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return res.status(400).json({ error: "No user found" });

    if (id === currentUser._id.toString()) {
      return res.status(400).json({ error: "Can't follow yourself" });
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
    res.status(200).json({ filteredUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { username, email, fullName, currentPassword, newPassword, link, bio } =
    req.body;
  let { profileImg, coverImg } = req.body;

  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return res.status(404).json({ error: "User not found!" });

    if (!currentPassword)
      return res.status(400).json({ error: "Current password is required!" });

    const isMatch = await bcrypt.compare(currentPassword, currentUser.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password!" });

    if (newPassword) {
      if (!currentPassword || !newPassword) {
        return res
          .status(404)
          .json({ error: "current password and new password are required!" });
      }
      if (currentPassword && newPassword) {
        if (newPassword.length < 6)
          return res
            .status(400)
            .json({ error: "password should be atleast 6 characters." });
        const salt = await bcrypt.genSalt(10);
        currentUser.password = await bcrypt.hash(newPassword, salt);
      }
    }

    if (profileImg) {
      if (currentUser.profileImg) {
        await cloudinary.uploader.destroy(
          currentUser.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (currentUser.coverImg) {
        await cloudinary.uploader.destroy(
          currentUser.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }
    currentUser.username = username || currentUser.username;
    currentUser.email = email || currentUser.email;
    currentUser.fullName = fullName || currentUser.fullName;
    currentUser.link = link || currentUser.link;
    currentUser.bio = bio || currentUser.bio;
    currentUser.profileImg = profileImg || currentUser.profileImg;
    currentUser.coverImg = coverImg || currentUser.coverImg;
    await currentUser.save();
    res.status(200).json({ "profile successfully updated.": currentUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getUserProfile, followUnfollowUser, suggestedProfiles, updateProfile };
