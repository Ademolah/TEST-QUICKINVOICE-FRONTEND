import React from "react";

const Input = ({ label, type = "text", value, onChange, placeholder, ...props }) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046A5] focus:border-[#0046A5] transition"
        {...props}
      />
    </div>
  );
};

export default Input;
