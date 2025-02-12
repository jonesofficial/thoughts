import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "cloudinary";

export const createPost = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString(); //to compare efficiently

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }

    if (!text && !img) {
      return res
        .status(400)
        .json({ error: "Post must have a image or a text" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img); //stores the uploaded image in a API called cloudinary
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log(`Error in create post controller ${error}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findOne({ _id: id });
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  if (post.img) {
    const imgId = post.img.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(imgId);
  }

  await Post.findByIdAndDelete({ _id: id });
  res.status(200).json({ message: "Post deleted successfully" });

  if (post.user.toString() !== req.user._id.toString()) {
    res
      .status(401)
      .json({ error: "You are not authorized to delete this post" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const usertoModify = await User.findById({ _id: userId });

    if (!text) {
      res
        .status(400)
        .json({ error: "Comment should include atleast a character" });
    }

    const post = await Post.findOne({ _id: postId });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }

    const comment = {
      user: userId,
      text: text,
    };

    const newNotification = new Notification({
      type: "comment",
      from: userId,
      to: usertoModify._id,
    });

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(`Error in commentPost Controller ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      // Like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: ["-password", "-email", "-followers", "-following"],
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(`Error in getAllPosts section: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "No user found!" });
    }

    const feedPosts = await Post.find({ user: { $in: user.following } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: ["-password", "-email", "-followers", "-following"],
      });
    res.status(200).json(feedPosts);
  } catch (error) {
    console.log(`Error in getFollwingPosts section ${error}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "No user found!" });
    }

    const userPosts = await Post.find({ user: user._id })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: ["-password", "-email", "-followers", "-following"],
      });
    res.status(200).json(userPosts);
  } catch (error) {
    console.log(`Error in getUserPosts section ${error}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};
