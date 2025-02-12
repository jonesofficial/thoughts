import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notifications/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SearchPage from "./pages/search/SearchPage";

import Sidebar from "./components/common/Sidebar";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { baseUrl } from "./constant/url";
import AboutSection from "./pages/about/AboutSection";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.error) {
          return null;
        }

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("Auth user:", data);
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });

  console.log(authUser);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div
      className="h-screen overflow-hidden"
      style={{ padding: "0% 5% 5% 5% " }} // Apply 5% padding globally
    >
      <div
        className={`h-screen ${authUser ? "flex" : "grid place-items-center"}`}
      >
        {/* Sidebar for authenticated users */}
        {authUser && <Sidebar className="w-64 bg-gray-800 h-full" />}

        {/* Main Content */}
        <div className="flex-grow h-full overflow-y-auto no-scrollbar ">
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={
                !authUser ? (
                  <div className="grid place-items-center h-screen bg-black">
                    <LoginPage />
                  </div>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/signup"
              element={
                !authUser ? (
                  <div className="grid place-items-center h-screen bg-black">
                    <SignUpPage />
                  </div>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/notifications"
              element={
                authUser ? <NotificationPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/search"
              element={authUser ? <SearchPage /> : <Navigate to="/login" />}
            />

            <Route
              path="/about"
              element={authUser ? <AboutSection /> : <Navigate to="/login" />}
            />

            <Route
              path="/profile/:username"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </div>
  );
}

export default App;
