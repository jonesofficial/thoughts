import { FaRegComment } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../constant/url";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/data";
import { IoMdCloseCircle } from "react-icons/io";

const Post = ({ post }) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/posts/${post._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went Wrong!");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.message || "An error occurred");
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/posts/like/${post._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went Wrong!");
      }

      return data;
    },
    onSuccess: (data) => {
      const isCurrentlyLiked = post.likes.includes(authUser._id);

      if (isCurrentlyLiked) {
        toast.error("Unliked");
      } else {
        toast.success("Liked");
      }

      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((p) => {
          if (p._id === post._id) {
            const isCurrentlyLiked = p.likes.includes(authUser._id);
            const updatedLikes = isCurrentlyLiked
              ? p.likes.filter((id) => id !== authUser._id) // Unlike
              : [...p.likes, authUser._id]; // Like

            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (err) => {
      toast.error(err.message || "An error occurred");
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/posts/comment/${post._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went Wrong!");
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success("Commented");

      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((p) => {
          if (p._id === post._id) {
            const updatedComments = [
              ...p.comments,
              { user: { ...authUser }, text: comment, _id: data.commentId },
            ];

            return { ...p, comments: updatedComments };
          }
          return p;
        });
      });

      setComment(""); // Clear the textarea after success
    },
    onError: (err) => {
      toast.error(err.message || "An error occurred");
    },
  });

  const postOwner = post.user;

  const isMyPost = authUser._id === post.user._id;

  const isLiked = post.likes.includes(authUser._id);

  const formattedDate = formatPostDate(post.createdAt);

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <div className="w-full max-w-5xl bg-gradient-to-r from-black via-black to-black rounded-2xl shadow-md p-4 mb-4 border border-gray-900 mx-auto sm:w-11/12 lg:w-full shadow-gray-900">
      <div className="flex gap-4 items-start flex-wrap">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-12 h-12 rounded-full overflow-hidden"
          >
            <img
              src={postOwner.profileImg || "/avatars/profile_placeholder.png"}
              alt="Profile"
              className="object-cover"
            />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center flex-wrap">
            <Link
              to={`/profile/${postOwner.username}`}
              className="font-bold text-base text-white"
            >
              {postOwner.fullName}
            </Link>
            <span className="text-gray-400 text-sm">
              @{postOwner.username} · {formattedDate}
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting ? (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500 text-gray-400"
                    onClick={handleDeletePost}
                  />
                ) : (
                  <LoadingSpinner size="sm" />
                )}
              </span>
            )}
          </div>
          <div
            className="mt-2 text-gray-200 break-words"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {post.text}
          </div>
          {post.img && (
            <img
              src={post.img}
              className="w-full h-auto object-cover rounded-lg border border-gray-700 mt-2"
              alt="Post content"
            />
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4">
          <div
            className="flex gap-1 items-center cursor-pointer group"
            onClick={handleLikePost}
          >
            {isLiking ? (
              <LoadingSpinner size="sm" />
            ) : isLiked ? (
              <FaHeart className="w-5 h-5 text-pink-500" />
            ) : (
              <FaRegHeart className="w-5 h-5 text-gray-400 group-hover:text-pink-500" />
            )}
            <span
              className={`text-sm ${
                isLiked
                  ? "text-pink-500"
                  : "text-gray-400 group-hover:text-pink-500"
              }`}
            >
              {post.likes.length}
            </span>
          </div>
          <div
            className="flex gap-1 items-center cursor-pointer group"
            onClick={() => {
              const modal = document.getElementById(
                "comments_modal" + post._id
              );
              if (modal) modal.showModal();
            }}
          >
            <FaRegComment className="w-5 h-5 text-gray-400 group-hover:text-sky-400" />
            <span className="text-sm text-gray-400 group-hover:text-sky-400">
              {post.comments.length}
            </span>
          </div>
        </div>
        <FaRegBookmark className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />
      </div>

      <dialog
        id={"comments_modal" + post._id}
        className="modal border-none outline-none bg-black p-4 rounded-lg shadow-lg w-full max-w-lg mx-auto"
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl" // Increased text size for bigger button
          onClick={(e) => {
            e.preventDefault();
            const modal = document.getElementById("comments_modal" + post._id);
            if (modal) modal.close();
          }}
        >
          <IoMdCloseCircle />
        </button>

        <div className="modal-box rounded border border-gray-600 ">
          <h3 className="font-bold text-lg mb-4 text-white">COMMENTS</h3>
          <div className="flex flex-col gap-3 max-h-60 overflow-auto">
            {post.comments.length === 0 && (
              <p className="text-sm text-slate-500">
                No comments yet 🤔 Be the first one 😉
              </p>
            )}
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex gap-2 items-start">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={comment.user.profileImg || "/avatar-placeholder.png"}
                      alt="userprofile"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{comment.user.fullName}</span>
                    <span className="text-gray-700 text-sm">
                      @{comment.user.username}
                    </span>
                  </div>
                  <div className="text-sm">{comment.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Form */}
        <form
          className="flex flex-col gap-1   border-gray-600 pt-1"
          onSubmit={handlePostComment}
        >
          <textarea
            className="textarea w-full p-2 rounded-lg text-md resize-none border border-gray-800 bg-gray-900 text-gray-200 focus:outline-none"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg"
            >
              {isCommenting ? <LoadingSpinner size="sm" /> : "Post Comment"}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default Post;
