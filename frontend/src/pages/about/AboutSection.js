import React from "react";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const AboutSection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b bg-black text-white p-8">
      <div className="max-w-3xl text-center space-y-6">
        {/* About the Creator */}
        <h1 className="text-4xl font-bold">About the Creator</h1>
        <p className="text-lg leading-relaxed">
          Hi there! 👋 I'm{" "}
          <span className="font-bold text-purple-500">Jones</span>, a passionate
          developer and the creator of this project.
        </p>
        <p className="text-lg leading-relaxed">
          This project was born out of my desire to put together all the stuffs
          I know as a project and also to know my potential. This project also
          motivated me to more and more stuffs and projects as a developer.
        </p>

        {/* Vision */}

        <p className="text-lg leading-relaxed">
          <span className="font-bold text-purple-500">Vision</span> <br />
          To create a platform that empowers users to connect, share, and grow
          while delivering meaningful value through technology.
        </p>

        {/* Functions of the Project */}
        <h2 className="text-3xl font-bold mt-10">Functions of the Project</h2>
        <ul className="list-disc text-left space-y-3 ml-6 text-lg leading-relaxed">
          <li>
            Enable seamless{" "}
            <span className="font-bold text-purple-500">
              {" "}
              user authentication{" "}
            </span>
            with secure login and signup functionality.
          </li>
          <li>
            Provide users with{" "}
            <span className="font-bold text-purple-500">
              personalized profiles
            </span>{" "}
            to share information and manage content.
          </li>
          <li>
            Facilitate{" "}
            <span className="font-bold text-purple-500">
              real-time notifications
            </span>{" "}
            to keep users updated on interactions and events.
          </li>
          <li>
            Offer a robust{" "}
            <span className="font-bold text-purple-500">search feature</span> to
            help users discover content or profiles easily.
          </li>
          <li>
            Ensure an intuitive and{" "}
            <span className="font-bold text-purple-500">
              {" "}
              responsive design
            </span>{" "}
            for a smooth user experience across devices.
          </li>
        </ul>
        <div className="flex flex-col items-center mt-8 space-y-4">
          <p>Feel free to connect with me:</p>
          <div className="flex space-x-6">
            {/* GitHub */}
            <a
              href="https://github.com/Jones3013"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-purple-500 transition"
            >
              <FaGithub size={30} />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/jonesofficial30/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-purple-500 transition"
            >
              <FaLinkedin size={30} />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/jon._.zz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-purple-500 transition"
            >
              <FaInstagram size={30} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
