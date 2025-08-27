// src/pages/Billing.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, Loader2, Clock } from "lucide-react";

// const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

export default function Billing() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserAndHistory = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const res = await axios.get(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // accept either { user: {...}} or {...}
        const userData = res.data.user || res.data;
        setUser(userData);

        // Optional: fetch payment history if route exists
        try {
          const h = await axios.get(`${API}/api/payments/history`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setHistory(h.data.history || h.data || []);
        } catch (err) {
          // ignore if not present (404) or log
          if (err.response && err.response.status !== 404) {
            console.warn("Payment history fetch failed:", err.message);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndHistory();
  }, []);

  const isPro = user?.plan === "pro";
  const proExpires = user?.proExpires ? new Date(user.proExpires) : null;

  const handleUpgrade = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to upgrade.");
      return;
    }

    try {
      setUpgradeLoading(true);
      const init = await axios.post(
        `${API}/api/payments/initialize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Paystack returns structure under data.data
      const checkoutUrl = init.data?.data?.authorization_url || init.data?.authorization_url;
      if (!checkoutUrl) {
        throw new Error("Payment initialization failed (missing checkout URL).");
      }
      // Redirect user to Paystack checkout
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Payment init error:", err);
      alert(err.response?.data?.message || err.message || "Failed to start payment.");
    } finally {
      setUpgradeLoading(false);
    }
  };

  // Loading & error UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-[#0046A5]" />
          <p className="mt-3 text-[#0046A5] font-semibold">Loading billing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="max-w-lg p-6 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold text-[#0046A5]">Billing</h3>
          <p className="mt-3 text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-[#0046A5] font-poppins">Billing & Subscription</h1>
            <p className="mt-1 text-gray-600">Manage your plan, view usage and payment history.</p>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm ${
              isPro ? "bg-[#00B86B]/10 text-[#00B86B]" : "bg-[#0046A5]/10 text-[#0046A5]"
            }`}>
              <CreditCard className={`${isPro ? "text-[#00B86B]" : "text-[#0046A5]"}`} />
              {isPro ? "PRO" : "FREE"}
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Plan card */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#0046A5]">Current Plan</h3>
                  <p className="mt-1 text-sm text-gray-500">Your active subscription</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#0046A5]">{(user?.plan || "Free").toUpperCase()}</p>
                  {proExpires && <p className="text-xs text-gray-500 mt-1">Expires {proExpires.toLocaleString()}</p>}
                </div>
              </div>

              <div className="mt-6">
                {!isPro ? (
                  <button
                    onClick={handleUpgrade}
                    disabled={upgradeLoading}
                    className="w-full bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white py-3 rounded-xl font-semibold shadow hover:opacity-95 disabled:opacity-60"
                  >
                    {upgradeLoading ? "Redirecting..." : "Upgrade to Pro (₦3,000 / month)"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle /> You have Pro
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Usage card */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {user?.plan === "free" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0046A5]">Usage This Month</h3>
                <Clock className="text-gray-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Invoices issued</p>
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-[#0046A5]"
                      style={{
                        width: `${Math.min(100, ((user?.usage?.invoicesThisMonth || 0) / 15) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {user?.usage?.invoicesThisMonth || 0} / 15 (free limit)
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Receipts issued</p>
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-[#00B86B]"
                      style={{
                        width: `${Math.min(100, ((user?.usage?.receiptsThisMonth || 0) / 15) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {user?.usage?.receiptsThisMonth || 0} / 15 (free limit)
                  </p>
                </div>
              </div>
            </div>)}
          </motion.div>

          {/* Account details */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
              <h3 className="text-lg font-semibold text-[#0046A5]">Account Details</h3>
              <p className="mt-3 text-sm text-gray-700">
                <span className="font-medium">{user?.accountDetails?.accountName || "-"}</span>
              </p>
              <p className="text-sm text-gray-500">
                {user?.accountDetails?.bankName || "-"} • {user?.accountDetails?.accountNumber || "-"}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Payment history */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-[#0046A5]">Payment History</h3>

            {history.length === 0 ? (
              <p className="mt-4 text-gray-600">Coming soon...</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="py-2">Date</th>
                      <th className="py-2">Reference</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2 text-sm text-gray-700">{new Date(h.createdAt || h.paidAt || h.date).toLocaleString()}</td>
                        <td className="py-2 text-sm text-gray-700">{h.reference || h.transaction || "-"}</td>
                        <td className="py-2 text-sm text-gray-700">₦{((h.amount || 0) / 100).toLocaleString()}</td>
                        <td className="py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${h.status === "success" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {h.status || h.paymentStatus || "unknown"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
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
