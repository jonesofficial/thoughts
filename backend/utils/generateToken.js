import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 1000, //time validity of the cookie
    httpOnly: true, //security
    sameSite: "strict", //security
    secure: process.env.NODE_ENV !== "developement",
  });
};

export default generateToken;
