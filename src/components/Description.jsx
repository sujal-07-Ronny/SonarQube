import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import aiImage from '../assets/ai.png';

const Description = () => {
  useEffect(() => {
    // This effect would typically contain animation initialization code
    // For a real implementation, you might use libraries like GSAP or Framer Motion
  }, []); 

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-xl animate-float" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-xl animate-float" style={{ animationDuration: '8s', animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-500/10 rounded-full blur-lg animate-ping" style={{ animationDuration: '8s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading Section with Animation */}
        <div className="text-center mb-16 opacity-0 animate-fadeIn" style={{ animation: 'fadeIn 1s forwards' }}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-gradientShift">
            Create AI Images
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            Turn Your Imagination into Stunning Visuals
          </p>
          <div className="w-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full animate-lineExpand" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}></div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Image with Effects */}
          <div className="md:w-2/5 relative group opacity-0 animate-fadeIn" style={{ animation: 'fadeIn 1s 0.5s forwards', perspective: '1000px' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-md opacity-20 group-hover:opacity-30 transition-all duration-300 transform -rotate-2 group-hover:-rotate-3"></div>
            <img
  src={aiImage}
  alt="AI Generated"
  className="relative w-full max-w-md rounded-xl shadow-lg transform transition-all duration-700 group-hover:scale-105 z-10 hover:rotate-y-12"
/>

            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-100 rounded-full z-0 opacity-70 animate-float" style={{ animationDuration: '6s' }}></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-100 rounded-full z-0 opacity-70 animate-float" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>

            {/* Animated particle effects */}
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping z-20" style={{ animationDuration: '2s' }}></div>
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping z-20" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
          </div>

          {/* Text Content */}
          <div className="md:w-3/5 opacity-0 animate-fadeIn" style={{ animation: 'fadeIn 1s 0.8s forwards' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-gray-800 animate-slideFromRight" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
              Introducing the <span className="text-blue-600 relative inline-block">
                AI-Powered
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 animate-lineExpand" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}></span>
              </span> Text to Image Generator
            </h2>

            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed animate-fadeIn" style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
                Easily bring your ideas to life with our free AI image generator. Whether you need stunning visuals or unique
                imagery, our tool transforms your text into eye-catching images with just a few clicks.
                <span className="font-medium text-blue-700"> Imagine it, describe it, and watch it come to life instantly.</span>
              </p>

              <p className="text-gray-700 text-lg leading-relaxed animate-fadeIn" style={{ animationDelay: '1.4s', animationFillMode: 'both' }}>
                Simply type in a text prompt, and our cutting-edge AI will generate high-quality images in seconds. From product
                visuals to character designs and portraits, even concepts that don't yet exist can be visualized effortlessly.
              </p>

              {/* Feature Highlights with Enhanced Hover Effect */}
              <div className="bg-white/60 p-6 rounded-lg shadow-sm mt-6 backdrop-blur-sm border border-blue-50 transition-all duration-500 hover:bg-white hover:shadow-md hover:border-blue-200 group animate-fadeIn transform hover:scale-102 hover:translate-y-1" style={{ animationDelay: '1.6s', animationFillMode: 'both' }}>
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-110 animate-pulse">
                    ✨
                  </div>
                  <h3 className="font-semibold text-gray-800 transition-all duration-300 group-hover:text-blue-700">Powered by Advanced AI</h3>
                </div>
                <p className="text-gray-600 pl-11 transition-all duration-300 group-hover:text-gray-800">
                  Unleash limitless creative possibilities with our state-of-the-art artificial intelligence technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideFromRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes lineExpand {
          from { width: 0; }
          to { width: 24rem; }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes rotate-y {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        .animate-fadeIn {
          animation: fadeIn 1s forwards;
        }

        .animate-slideUp {
          animation: slideUp 1s forwards;
        }

        .animate-slideFromRight {
          animation: slideFromRight 1s forwards;
        }

        .animate-lineExpand {
          animation: lineExpand 1s forwards;
        }

        .animate-gradientShift {
          background-size: 200% 200%;
          animation: gradientShift 5s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .hover\\:rotate-y-12:hover {
          transform: perspective(1000px) rotateY(12deg);
        }
      `}</style>
    </section>
  );
};

export default Description; 