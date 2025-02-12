import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg w-full max-w-md mx-auto shadow-lg">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow px-4 py-2 text-white bg-transparent border-none outline-none"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
