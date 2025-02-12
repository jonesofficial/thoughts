import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  // used to validate a user whether he/she is authorized by a token
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ error: "Unauthorized: No token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({ error: "Authorization failed!" });
    }

    const user = await User.findOne({ _id: decoded.userId }).select(
      "-password" //Select everything except password
    );

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(`Error in protectRoute middleware ${error}`);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export default protectRoute;
