import { useState } from "react";
import { Link } from "react-router-dom";
import { MdPassword } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons for show/hide password
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { baseUrl } from "../../../constant/url";
import ThoughtsbSvg from "../../../components/svgs/Thoughtsb";
import XSvg from "../../../components/svgs/X";
import { FaUser } from "react-icons/fa";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

import TrueFocus from "../../../constant/TrueFocus";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: "", // Can be username or email
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const queryClient = useQueryClient();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async ({ identifier, password }) => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: identifier,
          email: identifier,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed!");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.message || "An error occurred");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      // Corrected field names here
      toast.error("Please fill out all fields");
      return;
    }
    login(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen ">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <ThoughtsbSvg className="lg:w-[400px] fill-white" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-40 lg:hidden fill-white" />
          {/* <h3 className="text-4xl font-extrabold text-white">{"Let's"} go.</h3> */}

          <TrueFocus
            sentence="Lets GO!"
            manualMode={false}
            blurAmount={5}
            borderColor="#8b2fc9"
            animationDuration={2}
            pauseBetweenAnimations={1}
            className="text-2xl font-extrabold text-white "
          />
          <label className="input input-bordered rounded flex items-center gap-2">
            <FaUser />
            <input
              type="text"
              className="grow"
              placeholder="Username or Email"
              name="identifier"
              onChange={handleInputChange}
              value={formData.identifier}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2 relative">
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
              className="absolute right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isLoading ? <LoadingSpinner /> : "Login"}
          </button>
          {/* {isError && <p className="text-red-500">{error?.message}</p>} */}
        </form>
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-500 hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
