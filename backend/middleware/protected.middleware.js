import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "No token found" });
    const verified = jwt.verify(token, process.env.SECRET_KEY);

    if (!verified) return res.status(401).json({ error: "Not authorised!!" });

    const verifiedUser = await User.findById(verified.id);
    if (!verifiedUser)
      return res.status(401).json({ error: "Not authorised!!" });

    req.user = verifiedUser;
    // console.log(req.user);
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
