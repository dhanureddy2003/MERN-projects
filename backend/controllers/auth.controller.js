import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/generateTokens.js";
const authSignup = async (req, res) => {
  const { email, username, fullName, password } = req.body;

  if (
    [email, username, fullName, password].some(
      (feild) => !feild || feild.trim() === ""
    )
  )
    return res.status(400).json({ error: "No field can be empty!!" });

  // const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // if (!emailRegex.test(email))
  //   return res.status(400).json({ error: "invalid email format." });

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser)
    return res.status(400).json({ error: "User already exists!!" });

  // hashpassword

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    fullName,
    email,
    password: hashPassword,
  });
  await newUser.save();

  if (newUser) {
    generateTokenAndSetCookie(newUser._id, res);
  }

  res.json({
    data: "you successfully signed up",
    user: {
      id: newUser._id,
      username: newUser.username,
      password: newUser.password,
      email: newUser.email,
      fullName: newUser.fullName,
      followers: newUser.followers,
      following: newUser.following,
      link: newUser.link,
      bio: newUser.bio,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    },
  });
};

const authLogin = async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email) || !password) {
    return res
      .status(400)
      .json({ error: "Username or email, and password are required!" });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!existingUser) {
    return res.status(400).json({ error: "No user found!" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({ error: "Invalid credentials!" });
  }

  generateTokenAndSetCookie(existingUser._id, res);

  return res.status(200).json({ message: "Login successful",existingUser });
};

const authLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,  // Expire the cookie immediately
      httpOnly: true,
      secure: true,
      sameSite: "strict",  // Prevent CSRF attacks
    });
    return res.json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ error: "user not found" });

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export { authSignup, authLogin, authLogout, getMe };