import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        phone: Number(formData.phone), // ensure numeric
        businessName: formData.businessName,
        password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      console.log(res.data);
      // navigate("/dashboard");
      setTimeout(() => {
        navigate("/dashboard");
      }, 300); 
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0046A5] to-[#00B86B] p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#0046A5] mb-6">
          Create Your QuickInvoice NG Account
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (e.g. 2348012345678)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            required
          />

          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            required
          />

          {/* <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0046A5]"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-[#0046A5] font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
