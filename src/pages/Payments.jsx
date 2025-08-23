import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CreditCard, Zap, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// const API = "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("In-person NFC payment");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState(null); // null | 'pending' | 'success' | 'failed'
  const [message, setMessage] = useState("");
  const [hasSubaccount, setHasSubaccount] = useState(false);
  const navigate = useNavigate()

  const token = localStorage.getItem("token");

  // Try to ensure subaccount exists (idempotent)
  // const ensureSubaccount = async () => {
  //   try {
  //     const res = await axios.post(
  //       `${API}/api/payments/subaccount`,
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     if (res.data?.subaccount?.subaccount_code) setHasSubaccount(true);
  //   } catch (err) {
  //     console.error(err?.response?.data || err);
  //     setMessage(err?.response?.data?.message || "Unable to setup settlement subaccount");
  //   }
  // };

  // Ensure settlement subaccount exists (idempotent)
const ensureSubaccount = async () => {
  try {
    const res = await axios.post(
      `${API}/api/payments/subaccount`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const sub = res.data?.subaccount;
    if (sub?.subaccount_code) {
      setHasSubaccount(true);
      // optional: keep subaccount details in state for later use
      // setSubaccount(sub);
      hasSubaccount(sub)
    }
  } catch (err) {
    console.error("Subaccount setup error:", err?.response?.data || err.message || err);
    setMessage(err?.response?.data?.message || "Unable to setup settlement subaccount");
  }
};

  useEffect(() => {
    ensureSubaccount();
    // eslint-disable-next-line
  }, []);

  const initiate = async () => {
    if (!amount || Number(amount) <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }
    setLoading(true);
    setMessage("");
    setStatus(null);
    try {
      const res = await axios.post(
        `${API}/api/payments/initiate`,
        { amount: Number(amount), description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { authorization_url, reference } = res.data;
      setReference(reference);
      setStatus("pending");

      // Open Paystack checkout — behaves like “tap to pay” UX
      window.open(authorization_url, "_blank");

      // Start polling verification every 3s for up to ~2 minutes
      pollVerify(reference);
    } catch (err) {
      console.error(err?.response?.data || err);
      setMessage(err?.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const pollVerify = async (ref) => {
    setVerifying(true);
    const started = Date.now();
    const timeoutMs = 120000;

    const tick = async () => {
      try {
        const res = await axios.get(`${API}/api/payments/verify/${ref}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatus(res.data.status);
        if (res.data.status === "success") {
          setMessage("Payment successful!");
          setVerifying(false);
          return;
        }
        if (res.data.status === "failed") {
          setMessage("Payment failed.");
          setVerifying(false);
          return;
        }
        if (Date.now() - started < timeoutMs) {
          setTimeout(tick, 3000);
        } else {
          setMessage("Verification timed out. You can try again.");
          setVerifying(false);
        }
      } catch (err) {
        console.error(err?.response?.data || err);
        if (Date.now() - started < timeoutMs) {
          setTimeout(tick, 3000);
        } else {
          setMessage("Verification timed out.");
          setVerifying(false);
        }
      }
    };

    tick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-white to-[#ECFDF5] p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0046A5]">
              Accept Payments
            </h1>
            <p className="text-gray-600 mt-1">
              Seamlessly collect in-person payments with split settlement to your bank.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <ShieldCheck size={18} />
            Secured by Paystack
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
        >
          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (NGN)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 25000"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment note"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={initiate}
              disabled={loading || !hasSubaccount}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white shadow-md transition
                ${loading || !hasSubaccount ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#0046A5] to-[#00B86B] hover:shadow-lg'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
              {loading ? "Initializing..." : "Tap to Pay (NFC Style)"}
            </motion.button>

            {!hasSubaccount && (
              <div className="text-sm text-amber-600">
                Settlement account not set. We’ll auto-create it from your profile.
              </div>
            )}
          </div>

          {/* Status */}
          {(status || message) && (
            <div className="mt-6">
              <div className={`rounded-xl p-4 border
                ${status === 'success' ? 'bg-green-50 border-green-200' :
                  status === 'failed' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center gap-2">
                  {status === 'success' ? (
                    <CheckCircle2 className="text-green-600" />
                  ) : status === 'failed' ? (
                    <CreditCard className="text-red-600" />
                  ) : (
                    <Loader2 className="animate-spin text-blue-600" />
                  )}
                  <div className="font-medium">
                    {status === 'success' ? "Payment successful" :
                     status === 'failed' ? "Payment failed" :
                     verifying ? "Verifying payment..." : "Waiting for payment..."}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  {message}
                </div>
                {reference && (
                  <div className="mt-2 text-xs text-gray-500">Ref: {reference}</div>
                )}
              </div>
            </div>
          )}

          {/* Trust row */}
          <div className="mt-6 flex items-center gap-3 text-xs text-gray-500">
            <ShieldCheck size={16} />
            Your customer is redirected to Paystack’s secure checkout; funds settle into your linked bank via subaccount.
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
