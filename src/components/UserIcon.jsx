import React from "react";

const UserIcon = ({ size = 24, color = "#555" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Circle for head */}
            <circle cx="12" cy="8" r="4" fill={color} />
            
            {/* Body */}
            <path
                d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default UserIcon;
