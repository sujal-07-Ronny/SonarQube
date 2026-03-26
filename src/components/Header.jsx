import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const handleGenerateClick = () => {
    navigate('/result');
  };

  return (
    <div className="flex flex-col justify-center items-center text-center my-20 relative overflow-hidden">
      {/* Background Decorations */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
      />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-stone-500 inline-flex items-center text-center gap-2 bg-gradient-to-r from-white to-gray-50 px-6 py-1.5 rounded-full border border-neutral-300 shadow-sm hover:shadow-md transition-all duration-300 relative z-10"
      >
        <p className="font-medium text-gray-700">Best Text to Image Generator</p>
        <img src={assets.star_icon} alt="" className="animate-pulse w-5 h-5" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-4xl sm:text-7xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-900 bg-clip-text text-transparent mt-10 relative z-10"
      >
        Turn Text into{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent relative inline-block leading-tight">
          Image
        </span>{" "}
        in Seconds

      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4 }}
        className="text-center max-w-xl mx-auto mt-5 text-neutral-600 leading-relaxed relative z-10"
      >
        Unleash your creativity with AI. Turn your imagination into visual art in seconds - just type, and
        watch the magic happen.
      </motion.p>

      {/* Call to Action Button */}
      <motion.button
        onClick={handleGenerateClick}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6 }}
        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
        className="sm:text-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 w-auto mt-8 px-12 py-3 flex items-center gap-2 rounded-full shadow-md transition-all duration-300 relative z-10"
      >
        Generate Images
        <motion.img
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="h-6"
          src={assets.star_group}
          alt=""
        />
      </motion.button>

      {/* Sample Image Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8 }}
        className="flex flex-wrap justify-center mt-16 gap-3 relative z-10"
      >
        {Array(6).fill("").map((_, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative group"
          >
            <img
              className="rounded-lg transition-all duration-300 cursor-pointer max-sm:w-10 shadow-sm"
              src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1}
              alt=""
              width={70}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
        className="mt-2 text-neutral-600 font-medium relative z-10"
      >
        Generated Images from <span className="text-blue-600">imagify</span>
      </motion.p>
    </div>
  );
};

export default Header;