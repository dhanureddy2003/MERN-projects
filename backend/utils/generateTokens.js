import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign(
    {
      id: userId,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.cookie("jwt", token, {
    maxAge: 3600000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

};

export default generateTokenAndSetCookie;