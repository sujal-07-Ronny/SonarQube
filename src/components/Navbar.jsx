import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";



const Navbar = () => {
    const { user, setShowLogin, handleLogout } = useContext(AppContext);
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Safely extract user details with default credits
    const firstName = user?.name?.split(' ')[0] || '';
    const credits = user?.creditBalance ?? 5;

    const handleLogoutClick = () => {
        setIsLoggingOut(true);

        toast.info("Logging out...", {
            autoClose: 2000,
            position: "top-center",
            theme: "colored"
        });

        setTimeout(() => {
            handleLogout();
            toast.success("Logged out successfully!", {
                autoClose: 3000,
                position: "top-center",
                theme: "colored"
            });
            navigate('/');
            setIsLoggingOut(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-between py-4 px-6 sm:px-10 lg:px-16 bg-white shadow-md rounded-xl border border-gray-100">
            {/* Logo */}
            <Link to="/" className="group">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                >
                    <img
                        src={assets.logo}
                        alt="Logo"
                        className="w-24 sm:w-28 lg:w-32 transition-all duration-300 group-hover:opacity-90"
                    />
                </motion.div>
            </Link>

            {/* Navigation Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
                {user ? (
                    <>
                        {/* Credits Button */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <button
                                onClick={() => navigate('/pricing')}
                                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all text-white"
                            >
                                <img
                                    className="w-4 h-4"
                                    src={assets.credit_star}
                                    alt="Credits"
                                />
                                <span className="text-sm font-medium">
                                    Credits: <span className="font-bold">{credits}</span>
                                </span>
                            </button>
                        </motion.div>

                        {/* User Greeting */}
                        {firstName && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hidden sm:block text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded-lg"
                            >
                                Hi, <span className="text-teal-600">{firstName}</span>
                            </motion.p>
                        )}

                        {/* Logout Button */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                        >
                            <button
                                onClick={handleLogoutClick}
                                disabled={isLoggingOut}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${isLoggingOut
                                        ? 'bg-gray-300 text-gray-600'
                                        : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {isLoggingOut ? (   
                                    <>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="text-lg"
                                        >
                                            ↻
                                        </motion.span>
                                        <span>Logging Out</span>
                                    </>
                                ) : (
                                    <>
                                        <span>🚪</span>
                                        <span>Logout</span>
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </>
                ) : (
                    <>
                        {/* Pricing Link */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/pricing')}
                            className="text-gray-700 hover:text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Pricing
                        </motion.button>

                        {/* Login Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowLogin(true)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all font-medium"
                        >
                            Login
                        </motion.button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;  