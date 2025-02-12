// import { Link } from "react-router-dom";
// import { useState } from "react";
// import BlurText from "../../../constant/BlurText";

// import XSvg from "../../../components/svgs/X";
// import {
//   MdOutlineMail,
//   MdPassword,
//   MdDriveFileRenameOutline,
// } from "react-icons/md";
// import { FaUser } from "react-icons/fa";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons for show/hide password
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { baseUrl } from "../../../constant/url";

// import ThoughtsbSvg from "../../../components/svgs/Thoughtsb";
// import LoadingSpinner from "../../../components/common/LoadingSpinner";
// import SplashCursor from "../../../constant/SplashCursor";

// const SignUpPage = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     username: "",
//     fullName: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

//   const queryClient = useQueryClient();

//   const {
//     mutate: signup,
//     isError,
//     isLoading,
//     error,
//   } = useMutation({
//     mutationFn: async ({ email, username, fullName, password }) => {
//       const res = await fetch(`${baseUrl}/api/auth/signup`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify({ email, username, fullName, password }),
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Something went wrong!");
//       }

//       return data;
//     },
//     onSuccess: () => {
//       toast.success("Account created successfully");

//       queryClient.invalidateQueries({ queryKey: ["authUser"] });
//     },
//     onError: (err) => {
//       toast.error(err.message || "An error occurred");
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (
//       !formData.email ||
//       !formData.username ||
//       !formData.fullName ||
//       !formData.password
//     ) {
//       toast.error("Please fill out all fields");
//       return;
//     }

//     signup(formData);
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const [showSplash, setShowSplash] = useState(false);

//   return (
//     <div className="max-w-screen-xl mx-auto flex h-screen">
//       <div className="flex-1 hidden lg:flex items-center justify-center bg-black">
//         <ThoughtsbSvg className="lg:w-[500px] fill-white" />
//       </div>

//       {showSplash && <SplashCursor />}
//       <div className="flex-1 flex flex-col justify-center items-center">
//         <form
//           className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
//           onSubmit={handleSubmit}
//           onMouseEnter={() => setShowSplash(false)}
//           onMouseLeave={() => setShowSplash(false)}
//         >
//           {/* <ThemeToggleButton className="" /> */}
//           <XSvg className="w-24 lg:hidden fill-white" />

//           <BlurText
//             className="text-4xl font-extrabold text-white"
//             text="Join Today!"
//             delay={150}
//             animateBy="words"
//             direction="top"
//           />
//           <label className="input input-bordered rounded flex items-center gap-2">
//             <MdOutlineMail />
//             <input
//               type="email"
//               className="grow"
//               placeholder="Email"
//               name="email"
//               onChange={handleInputChange}
//               value={formData.email}
//               aria-label="Email"
//             />
//           </label>
//           <div className="flex gap-4 flex-wrap">
//             <label className="input input-bordered rounded flex items-center gap-2 flex-1">
//               <FaUser />
//               <input
//                 type="text"
//                 className="grow"
//                 placeholder="Username"
//                 name="username"
//                 onChange={handleInputChange}
//                 value={formData.username}
//                 aria-label="Username"
//               />
//             </label>
//             <label className="input input-bordered rounded flex items-center gap-2 flex-1">
//               <MdDriveFileRenameOutline />
//               <input
//                 type="text"
//                 className="grow"
//                 placeholder="Full Name"
//                 name="fullName"
//                 onChange={handleInputChange}
//                 value={formData.fullName}
//                 aria-label="Full Name"
//               />
//             </label>
//           </div>
//           <label className="input input-bordered rounded flex items-center gap-2 relative">
//             <MdPassword />
//             <input
//               type={showPassword ? "text" : "password"} // Toggle type based on showPassword state
//               className="grow"
//               placeholder="Password"
//               name="password"
//               onChange={handleInputChange}
//               value={formData.password}
//               aria-label="Password"
//             />
//             <button
//               type="button"
//               className="absolute right-3 text-gray-500"
//               onClick={() => setShowPassword(!showPassword)}
//               aria-label={showPassword ? "Hide Password" : "Show Password"}
//             >
//               {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//             </button>
//           </label>
//           <button className="btn rounded-full btn-primary text-white">
//             {isLoading ? <LoadingSpinner /> : "Sign up"}
//           </button>
//           {isError && (
//             <p className="text-red-500">
//               {error?.message || "An error occurred"}
//             </p>
//           )}
//         </form>
//         <div
//           className="flex flex-col lg:w-2/3 gap-2 mt-4"
//           onMouseEnter={() => setShowSplash(false)}
//           onMouseLeave={() => setShowSplash(false)}
//         >
//           <p className="text-sm text-gray-400">
//             Already have an account?{" "}
//             <Link to="/login" className="text-purple-500 hover:underline">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;

import { Link } from "react-router-dom";
import { useState } from "react";
import BlurText from "../../../constant/BlurText";

import XSvg from "../../../components/svgs/X";
import {
  MdOutlineMail,
  MdPassword,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons for show/hide password
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { baseUrl } from "../../../constant/url";

import ThoughtsbSvg from "../../../components/svgs/Thoughtsb";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/signup`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        console.log(data);
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // page won't reload
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <ThoughtsbSvg className="lg:w-96 lg:h-96 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <BlurText
            className="text-4xl font-extrabold text-white"
            text="Join Today!"
            delay={150}
            animateBy="words"
            direction="top"
          />
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type={showPassword ? "text" : "password"}
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
            <button
              type="button"
              className=" text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? <LoadingSpinner size="sm" /> : "Sign up"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-500 hover:underline">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
