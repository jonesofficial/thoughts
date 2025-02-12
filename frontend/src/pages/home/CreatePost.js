import { IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmojiPicker from "emoji-picker-react";
import { baseUrl } from "../../constant/url";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CreatePost = ({ onClose }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const imgRef = useRef(null);

  const queryClient = useQueryClient();

  const {
    mutate: CreatePost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      const res = await fetch(`${baseUrl}/api/posts/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, img }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      return await res.json();
    },
    onSuccess: () => {
      setImg(null);
      setText("");
      onClose(); // Close the modal on success
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    CreatePost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prevText) => prevText + emojiData.emoji);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-black rounded-xl p-6 shadow-2xl w-full max-w-lg">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold">Create a Post</h2>
          <IoCloseSharp
            className="text-gray-500 cursor-pointer"
            size={24}
            onClick={onClose}
          />
        </div>

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <textarea
            className="textarea w-full text-lg resize-none border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Express your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {img && (
            <div className="relative">
              <IoCloseSharp
                className="absolute top-1 right-1 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                onClick={() => {
                  setImg(null);
                  imgRef.current.value = null;
                }}
              />
              <img
                src={img}
                className="w-full h-64 object-cover rounded-lg shadow-md"
                alt="Uploaded"
              />
            </div>
          )}

          <div className="flex justify-between items-center border-t pt-4">
            <div className="relative">
              <div className="flex gap-2 items-center">
                <CiImageOn
                  className="text-purple-500 w-6 h-6 cursor-pointer"
                  onClick={() => imgRef.current.click()}
                />
                <BsEmojiSmileFill
                  className="text-yellow-500 w-6 h-6 cursor-pointer"
                  onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
                />
              </div>

              {isEmojiPickerOpen && (
                <div className="absolute z-50 mt-2">
                  <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                </div>
              )}
            </div>
            <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
            <button
              className="btn btn-primary rounded-full btn-sm text-white px-6"
              disabled={isPending}
            >
              {isPending ? <LoadingSpinner size="sm" /> : "Post"}
            </button>
          </div>
          {isError && <div className="text-red-500">{error.message}</div>}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
