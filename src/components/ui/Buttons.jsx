import React from "react";

const Button = ({ children, onClick, type = "button", variant = "primary", className = "", ...props }) => {
  const baseStyles =
    "px-5 py-2 rounded-xl font-medium shadow-md transition focus:outline-none focus:ring-2";

  const variants = {
    primary:
      "bg-[#0046A5] text-white hover:bg-[#003a8a] focus:ring-[#0046A5]",
    secondary:
      "bg-[#00B86B] text-white hover:bg-[#009a59] focus:ring-[#00B86B]",
    outline:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
