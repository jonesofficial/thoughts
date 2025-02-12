import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "User mot found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in user profile controller ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

//FollowUnfollow

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const usertoModify = await User.findById({ _id: id });
    const currentUser = await User.findById({ _id: req.user._id });

    if (id === userId) {
      res.status(400).json({ error: "Can't follow/unfollow yourself" });
    }

    if (!usertoModify || !currentUser) {
      res.status(404).json({ error: "No user found!" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //unfollow
      await User.findByIdAndUpdate(
        { _id: id },
        { $pull: { followers: userId } }
      );
      await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { following: id } }
      );
      res.status(200).json({ message: "Unfollowed Successfully" });
    } else {
      //follow
      await User.findByIdAndUpdate(
        { _id: id },
        { $push: { followers: userId } }
      );
      await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { following: id } }
      );
      //send notification
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: usertoModify._id,
      });
      await newNotification.save();

      res.status(200).json({ message: "Followed Successfully" });
    }
  } catch (error) {
    console.log(`Error in Follow Unfollow Controller ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//updateUser

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, fullName, email, currentPassword, newPassword } =
      req.body;

    let { profileImg, coverImg } = req.body;

    let user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({ error: "Please fill both credentials" });
    }

    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res(400).json({ error: "Your Password is incorrect" });
      }

      if (newPassword.length < 8) {
        return res(400).json({
          error: "Password must be atleast 8 characters",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      //https://res.cloudinary.com/dcp7yipbt/image/upload/v1726817523/cld-sample-5.jpg
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          //we need only the cld-sample-5
          user.profileImg.split("/").pop().split(".")[0] //split("/") means splits the url into seperate ones, pop() removes last one, split(".") is to remove jpg,
        ); //[0] stores the file name
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
      coverImg = uploadedResponse.secure_url; // Save new cover image URL
    }

    user.username = username || user.username;
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    //Here the password is kept null to make it confidential and ofcourse we are saving it only after we save the user
    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already in use" });
    }
    console.log(`Error in update user section ${error}`);
    res.status(404).json({ error: "Internal server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    // If no query is provided, ie the username to search for
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Perform a case-insensitive search on username and fullName fields
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } }, // Search by username
        { fullName: { $regex: query, $options: "i" } }, // Search by full name
      ],
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found matching your query." });
    }

    res.status(200).json(users); // sends the user as a array
  } catch (error) {
    console.log(`Error in searchUsers controller: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
