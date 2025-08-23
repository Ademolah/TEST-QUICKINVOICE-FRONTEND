import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Contact from "../pages/Contact";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <div className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white font-bold text-lg px-3 py-1 rounded-lg shadow-sm">
            <Link to="/">
            Q
            </Link>
          </div>
          <h1 className="font-poppins font-bold text-xl text-gray-800">
            <Link to="/">
            QuickInvoice
            </Link>
            <span className="text-[#00B86B]"> NG</span>
          </h1>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-inter">
          {/* <Link
            to="/"
            className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
          >
            Home
          </Link> */}
          <Link
            to="/#features"
            className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
          >
            Features
          </Link>
          <Link
            to="/#pricing"
            className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
          >
            Contact
          </Link>
        </div>

        {/* Auth Buttons (Desktop) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-center gap-4"
        >
          <Link
            to="/login"
            className="px-5 py-2 border-2 border-[#0046A5] text-[#0046A5] rounded-lg font-medium hover:bg-[#0046A5] hover:text-white transition-all duration-300 shadow-sm"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
          >
            Register
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={toggleDrawer}
        >
          {drawerOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white font-bold text-lg px-3 py-1 rounded-lg shadow-sm">
              Q
            </div>
            <h1 className="font-poppins font-bold text-xl text-gray-800">
              QuickInvoice
              <span className="text-[#00B86B]"> NG</span>
            </h1>
          </div>
          <button
            onClick={toggleDrawer}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col mt-6 space-y-4 px-4 font-inter">
          <Link
            to="/"
            className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
            onClick={toggleDrawer}
          >
            Home
          </Link>
          <Link
            to="/#features"
            className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
            onClick={toggleDrawer}
          >
            Features
          </Link>
          <Link
            to="/#pricing"
            className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
            onClick={toggleDrawer}
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-[#0046A5] transition-colors duration-200 font-medium"
            onClick={toggleDrawer}
          >
            Contact
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 border-2 border-[#0046A5] text-[#0046A5] rounded-lg font-medium hover:bg-[#0046A5] hover:text-white transition-all duration-300 shadow-sm"
            onClick={toggleDrawer}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            onClick={toggleDrawer}
          >
            Register
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleDrawer}
        ></div>
      )}
    </nav>
  );
}
