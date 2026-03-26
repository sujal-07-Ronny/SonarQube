import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const GenerateBtn = () => {
  // Handle button click
  const handleClick = () => {
    window.location.href = "http://localhost:5173/result";
  };

  return (  
    <div className="pb-16 text-center">
      {/* Magical Gradient Text with Animation */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold py-6 
        md:py-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
      > 
        See The Magic. Try Now
      </motion.h1>

      {/* Call to Action Button with Hover Glow Effect */}
      <motion.button 
        onClick={handleClick}
        whileHover={{ scale: 1.08, boxShadow: "0px 0px 16px rgba(147, 51, 234, 0.7)" }} 
        transition={{ duration: 0.3 }}
        className="inline-flex items-center gap-2 px-12 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white
        m-auto transition-all duration-500 shadow-lg border border-purple-300 relative overflow-hidden"
      >
        Generate Images
        <motion.img 
          src={assets.star_group} 
          alt="Stars"
          className="h-6 animate-pulse"
          whileHover={{ rotate: 15, transition: { duration: 0.3 } }}
        />
      </motion.button>
    </div>  
  );
};

export default GenerateBtn;
