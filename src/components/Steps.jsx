import React from "react";
import { stepsData } from "../assets/assets";

const Steps = () => {
    return (  
        <div className="flex flex-col items-center justify-center my-32 px-4">
            
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">How it Works</h1>
                <p className="text-lg text-gray-600">Transform Words Into Stunning Images</p>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="space-y-6 w-full max-w-3xl">
                {stepsData.map((item, index) => (   
                    <div 
                        key={index} 
                        className="flex items-center gap-6 p-6 bg-white shadow-lg border border-gray-100 cursor-pointer
                        hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-xl relative overflow-hidden group"
                    >
                        <div className="absolute -left-12 -top-12 bg-gradient-to-br from-blue-500/10 to-purple-600/10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500"></div>
                        
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-xl relative z-10 flex items-center justify-center">
                            <img src={item.icon} alt={item.title} className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"/>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                                <span className="text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-0.5 rounded-full">Step {index + 1}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>  
    );
}

export default Steps;