// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { baseUrl } from "../../constant/url";
// import Header from "../../components/common/Header";

// const SearchPage = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate(); // Initialize navigation

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) {
//       setError("Please enter a search query.");
//       return;
//     }

//     try {
//       setError(""); // Clear previous errors

//       // Make the API call to the search endpoint
//       const res = await fetch(
//         `${baseUrl}/api/users/search?query=${searchQuery}`,
//         {
//           method: "GET",
//           credentials: "include", // Include cookies for authentication
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.status === 404) {
//         setError("No users found matching your query.");
//         setResults([]);
//         return;
//       }

//       if (!res.ok) {
//         throw new Error("Something went wrong.");
//       }

//       const data = await res.json(); // Parse the JSON response
//       setResults(data); // Update the results
//     } catch (err) {
//       setError("An error occurred. Please try again.");
//     }
//   };

//   const handleUserClick = (username) => {
//     navigate(`/profile/${username}`); // Navigate to the user profile page
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center p-4">
//       <Header />

//       {/* Search Input */}
//       <div className="flex items-center w-full max-w-md mb-4 pt-10">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Search by username or full name"
//           className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring focus:border-purple-500"
//         />
//         <button
//           onClick={handleSearch}
//           className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700"
//         >
//           Search
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Results */}
//       <div className="w-full max-w-md mt-4">
//         {results.length > 0 && (
//           <ul className=" shadow-lg rounded-lg divide-y divide-gray-200">
//             {results.map((user) => (
//               <li
//                 key={user._id}
//                 className="p-4 flex items-center cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleUserClick(user.username)} // Navigate on click
//               >
//                 <img
//                   src={user.profilePicture || "/default-avatar.png"}
//                   alt={user.username}
//                   className="w-10 h-10 rounded-full mr-4"
//                 />
//                 <div>
//                   <p className="font-semibold">{user.username}</p>
//                   <p className="text-sm text-gray-600">{user.fullName}</p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}

//         {results.length === 0 && !error && (
//           <p className="text-gray-500">Start typing to search for users.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../constant/url";
import Header from "../../components/common/Header";
import LoadingSpinner from "../../components/common/LoadingSpinner"; // Import the spinner component

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for spinner
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      setError(""); // Clear any previous errors
      setIsLoading(false); // Stop loading spinner
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setIsLoading(true); // Start spinner
        setError(""); // Clear errors

        const res = await fetch(
          `${baseUrl}/api/users/search?query=${searchQuery}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 404) {
          setResults([]);
          setShowDropdown(false);
          setError("No users found matching your query."); // Show error
          setIsLoading(false); // Stop spinner
          return;
        }

        if (!res.ok) throw new Error("Something went wrong.");

        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (err) {
        setError("An error occurred. Please try again.");
        setShowDropdown(false);
      } finally {
        setIsLoading(false); // Stop spinner in all cases
      }
    }, 300); // Debounce API call

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleUserClick = (username) => {
    setSearchQuery(""); // Clear input after selection
    setShowDropdown(false); // Hide suggestions
    navigate(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 relative">
      <Header />

      {/* Search Input */}
      <div className="relative w-full max-w-md pt-10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username or full name"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-purple-500"
        />

        {/* Loading Spinner Below the Input */}
        {isLoading && (
          <div className="flex justify-center mt-2">
            <LoadingSpinner size="sm" />
          </div>
        )}

        {/* Suggestions Dropdown */}
        {!isLoading && showDropdown && results.length > 0 && (
          <ul className="absolute w-full shadow-lg rounded-lg divide-y z-50 ">
            {results.map((user) => (
              <li
                key={user._id}
                className="p-3 flex items-center cursor-pointer hover:bg-gray-900"
                onClick={() => handleUserClick(user.username)}
              >
                <img
                  src={user.profileImg || "/avatars/profile_placeholder.png"}
                  alt={user.username}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.fullName}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Error Message */}
        {!isLoading && error && (
          <p className="text-red-500 mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
