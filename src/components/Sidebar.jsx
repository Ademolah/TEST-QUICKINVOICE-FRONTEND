import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  FileText,
  Users,
  BarChart2,
  Settings,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  ReceiptIcon,
  DollarSignIcon, 
  Building
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Invoices", icon: <FileText size={20} />, path: "/invoices" },
    { name: "Receipts", icon: <ReceiptIcon size={20} />, path: "/receipts" },
    { name: "Stocks", icon: <Building size={20} />, path: "/inventory" },
    { name: "Clients", icon: <Users size={20} />, path: "/clients" },
    { name: "Delivery", icon: <DollarSignIcon size={20} />, path: "/delivery" },
    { name: "Reports", icon: <BarChart2 size={20} />, path: "/reports" },
    { name: "Billing", icon: <DollarSignIcon size={20} />, path: "/billing" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { name: "Support", icon: <HelpCircle size={20} />, path: "/support" },
  ];

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
      location.pathname === path
        ? "bg-white/20 text-white font-semibold shadow-md"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    // localStorage.clear();
    // window.location.href = "/";
    navigate("/");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-blue-600 to-green-500 p-2 rounded-lg shadow-lg text-white"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-gradient-to-b from-[#0046A5] to-[#00B86B] text-white p-4 shadow-xl justify-between">
        {/* Top Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">QuickInvoice <span className="text-green-300">NG</span></h2>
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link key={link.name} to={link.path} className={linkClass(link.path)}>
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section (Logout) */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative bg-gradient-to-b from-[#0046A5] to-[#00B86B] w-64 p-4 shadow-lg flex flex-col justify-between">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              <X size={24} />
            </button>

            {/* Top Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-white">
                QuickInvoice <span className="text-green-300">NG</span>
              </h2>
              <nav className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={linkClass(link.path)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Bottom Section (Logout) */}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300 mb-4"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;


