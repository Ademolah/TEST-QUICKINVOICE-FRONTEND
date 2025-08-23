import React, { useState, useEffect } from "react";
import axios from "axios";
// import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";


// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const navigate = useNavigate()

  const handleChangePassword = async (e) => {
  e.preventDefault();
  if (newPassword !== confirmNewPassword) {
    toast.error('New passwords do not match');
    return;
  }

  try {
    setLoadingPassword(true);
    const token = localStorage.getItem('token');

    await axios.put(
      `${API}/api/users/change-password`,
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Error changing password');
  } finally {
    setLoadingPassword(false);
  }
};

  // Fetch existing bank details on mount
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API}/api/users/account-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data) {
          setBankDetails({
            accountName: res.data.accountName || "",
            accountNumber: res.data.accountNumber || "",
            bankName: res.data.bankName || "",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load account details");
      }
    };
    fetchBankDetails();
  }, []);

  const handleChange = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/api/users/account-details`,
        bankDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Bank account details updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update account details");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="p-6 bg-gray-50 min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />
        
      <h1 className="text-3xl font-bold text-[#0046A5] mb-6">
        ⚙️ Settings
      </h1>

      {/* Bank Account Details */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          💳 Bank Account Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Account Name</label>
            <input
              type="text"
              name="accountName"
              value={bankDetails.accountName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0046A5] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={bankDetails.accountNumber}
              onChange={handleChange}
              placeholder="0123456789"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0046A5] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={bankDetails.bankName}
              onChange={handleChange}
              placeholder="GTBank"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0046A5] outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0046A5] hover:bg-[#00357d] text-white py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Profile Info Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          🧑‍💼 Profile Information
        </h2>
        <p className="text-gray-500 mb-4">
          This section will allow updating your personal and business details.
        </p>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-not-allowed">
          Coming Soon
        </button>
      </div>


      {/* change password  */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
    <h3 className="font-semibold text-lg mb-4">Change Password</h3>
    <form onSubmit={handleChangePassword} className="space-y-4">
        <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="border p-2 rounded w-full"
        required
        />
    <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="border p-2 rounded w-full"
      required
    />
    <input
      type="password"
      placeholder="Confirm New Password"
      value={confirmNewPassword}
      onChange={(e) => setConfirmNewPassword(e.target.value)}
      className="border p-2 rounded w-full"
      required
    />
    <button
      type="submit"
      disabled={loadingPassword}
      className="bg-[#0046A5] hover:bg-[#0056c0] text-white font-semibold py-2 px-4 rounded-lg shadow"
    >
      {loadingPassword ? 'Changing...' : 'Change Password'}
    </button>
  </form>
</div>

{/* Back to Dashboard button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          ⬅ Back to Dashboard
        </button>
      </div>

    </div>
  );
}
