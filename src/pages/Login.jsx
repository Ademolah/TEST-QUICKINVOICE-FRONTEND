import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const res = await axios.post(`${API}/api/auth/login`, formData);
  //     localStorage.setItem("token", res.data.token);
  //     navigate("/dashboard");
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Login failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await axios.post(`${API}/api/auth/login`, formData);
    console.log(formData);
    

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      // wait until it's saved
      setTimeout(() => {
        navigate("/dashboard");
      }, 300); 
    } else {
      setError("No token received. Please try again.");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0046A5] to-[#00B86B] p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-[#0046A5] to-[#00B86B] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
            Q
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold font-poppins text-center text-[#0046A5] mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-6 font-inter">
          Sign in to your QuickInvoice NG account
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-1 font-inter">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium text-sm mb-1 font-inter">
              Password
            </label>
            {/* <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5] transition duration-200"
              required
            /> */}

            <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-[#00477B] focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          </div>

          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="text-[#0046A5] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white font-semibold hover:opacity-90 transition duration-200 shadow-md"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6 font-inter">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#0046A5] hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
