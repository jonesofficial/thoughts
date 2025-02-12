import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import notificationRoute from "./routes/notification.route.js";
import connectDB from "./db/connectDB.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();

app.use(
  express.json({
    limit: "5mb", //default is 100kb
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cookieParser());

app.use(
  cors({
    //used as a security to only allow req websites etc
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/notification", notificationRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server running at ${port}`);
  connectDB();
});
