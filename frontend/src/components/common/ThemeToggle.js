import React, { useState } from "react";

const ThemeToggleButton = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "light" : "black"
    );
  };

  return (
    <div>
      <button
        onClick={toggleTheme}
        className={`btn ${
          isDark ? "btn-dark" : "btn-light"
        } flex justify-end px-4 py-2 rounded-md focus:outline-none`}
      >
        {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </div>
  );
};

export default ThemeToggleButton;
