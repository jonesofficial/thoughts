import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiStar, FiUsers, FiPlus } from "react-icons/fi";
import Header from "../../components/common/Header";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full">
        <Header />

        {/* Feed Type Selector */}
        <div className="relative flex items-center gap-4 justify-center bg-gray-800 rounded-full p-1 w-2/3 shadow-inner mt-4 mx-auto">
          <motion.div
            className="absolute bg-purple-600 rounded-full w-1/2 h-full shadow-md"
            layout
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{
              left: feedType === "forYou" ? "0%" : "50%",
            }}
          ></motion.div>

          <button
            className={`relative z-10 flex items-center justify-center gap-1 w-1/2 text-sm font-medium py-1 rounded-full transition-all ${
              feedType === "forYou" ? "text-white" : "text-black"
            }`}
            onClick={() => setFeedType("forYou")}
          >
            <FiStar size={16} />
            For You
          </button>

          <button
            className={`relative z-10 flex items-center justify-center gap-1 w-1/2 text-sm font-medium py-1 rounded-full transition-all ${
              feedType === "following" ? "text-white" : "text-black"
            }`}
            onClick={() => setFeedType("following")}
          >
            <FiUsers size={16} />
            Following
          </button>
        </div>
      </div>

      {/* POSTS FEED */}
      <div className="flex flex-col w-full max-w-5xl rounded-lg shadow-md p-4 shadow-gray-900 mt-6">
        <Posts feedType={feedType} />
      </div>

      {/* Floating Action Button for Creating a Post */}
      <div className="fixed bottom-8 right-8">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-purple-700 p-6 rounded-full cursor-pointer shadow-md shadow-purple-950"
          onClick={() => setModalOpen(true)}
        >
          <FiPlus size={24} className="text-white" />
        </motion.div>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && <CreatePost onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default HomePage;
