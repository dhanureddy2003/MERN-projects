import { Notification } from "../models/notification.model.js";
import { Comment, Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { img, text } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    let uploadedImgUrl = null;

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      uploadedImgUrl = uploadedResponse.secure_url;
    }

    const post = new Post({
      user: userId,
      img: uploadedImgUrl,
      text,
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.user.toString() !== req.user._id.toString())
      return res.status(401).json({ error: "Unauthorized" });
    if (post.img) {
      await cloudinary.uploader.destroy(
        post.img.split("/").pop().split(".")[0]
      );
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const { img, text } = req.body;

    if (post.user._id.toString() !== req.user._id.toString())
      return res.json({ error: "Unauthorised access!!" });
    if (img) {
      if (post.img) {
        await cloudinary.uploader.destroy(
          post.img.split("/").pop().split(".")[0]
        );
      }
      const uploaderResponse = await cloudinary.uploader.upload(img);
      img = uploaderResponse.secure_url;
    }
    post.text = text || post.text;
    post.img = img || post.img;

    await post.save();
    res.status(200).json({ "Post updated successfully ": post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const { text } = req.body;
    if (!text)
      return res.status(404).json({ error: "text is required to comment." });
    const comment = new Comment({
      user: req.user._id,
      text: text,
    });
    await comment.save();

    post.comments.push(comment);
    await post.save();
    res.status(200).json({ "comment added ": { comment, post } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likeDislike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    const user = await User.findById(userId);
    if (!post) return res.status(404).json({ error: "post not found" });
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
      user.likedPosts.pull(postId);
    } else {
      post.likes.push(userId);
      user.likedPosts.push(postId);
    }
    await post.save();
    await user.save();
    const notification = new Notification({
      from: userId,
      to: post.user,
      type: "like",
    });
    await notification.save();
    res.status(200).json({ "post liked ": post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdat: -1 }).populate({
      path: "user",
      select: "-password",
    });
    if (posts.length === 0)
      return res.status(404).json({ error: "No posts found" });
    res.status(200).json({ "Posts ": posts });
  } catch (error) {
    res.status(500).json({ "error in retrieving posts": error.message });
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const followedUsersPosts = await Post.find({
      user: { $in: user.following },
    })
      .sort({ createdat: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments",
      });
    res.status(200).json({ "posts of users you follow": followedUsersPosts });
  } catch (error) {
    res
      .status(500)
      .json({ "error in retrieving posts of users you follow": error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const  username  = req.params.username;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });
    const userPosts = await Post.find({user : user._id}).sort({createdAt : -1}).populate({
      path : 'user',
      select : '-password'
    })
    res.status(200).json({ "posts of user": userPosts });
  } catch (error) {
    res
      .status(500)
      .json({ "error in retrieving posts of users": error.message });
  }
};

export {
  createPost,
  deletePost,
  updatePost,
  commentOnPost,
  likeDislike,
  getPosts,
  getFollowingPosts,
  getUserPosts
};
