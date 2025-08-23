import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CreditCard, Nfc, CheckCircle2, XCircle, Loader2, Shield } from "lucide-react";

// const API = "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState("NFC"); // NFC | QR | LINK (future)
  const [status, setStatus] = useState("idle"); // idle | initiating | waiting_nfc | processing | success | failed
  const [error, setError] = useState("");
  const [tx, setTx] = useState(null); // { reference, amount, status }
  const [nfcSupported, setNfcSupported] = useState(false);
  const captureRef = useRef(null);

  useEffect(() => {
    setNfcSupported('NDEFReader' in window || 'nfc' in navigator);
  }, []);

  const token = localStorage.getItem("token");

  const initiatePayment = async () => {
    setError("");
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid charge amount.");
      return;
    }
    try {
      setStatus("initiating");
      const res = await axios.post(
        `${API}/api/payments/initiate`,
        { amount: Number(amount), method, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTx(res.data);
      return res.data; // { reference, amount, status }
    } catch (e) {
      setStatus("idle");
      setError(e?.response?.data?.message || "Unable to initiate payment.");
      throw e;
    }
  };

//   const initiatePayment = async () => {
//   setError("");
//   if (!amount || Number(amount) <= 0) {
//     setError("Please enter a valid charge amount.");
//     return;
//   }
//   try {
//     setStatus("initiating");
//     const res = await axios.post(
//       `${API}/api/payments/initiate`,
//       { amount: Number(amount), method, note },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     const txData = {
//       reference: res.data.reference,
//       amount: Number(amount),
//       status: "pending",
//     };
//     setTx(txData);
//     return txData;
//   } catch (e) {
//     setStatus("idle");
//     setError(e?.response?.data?.error || "Unable to initiate payment.");
//     throw e;
//   }
// };


  const confirmPayment = async ({ reference, cardToken }) => {
    // cardToken is the tokenized card “tap” payload (mocked for now)
    try {
      setStatus("processing");
      const res = await axios.post(
        `${API}/api/payments/confirm`,
        { reference, cardToken },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTx(res.data);
      setStatus(res.data.status === "success" ? "success" : "failed");
    } catch (e) {
      setStatus("failed");
      setError(e?.response?.data?.message || "Payment failed to confirm.");
    }
  };

  const handleTapToPay = async () => {
    try {
      const pending = await initiatePayment();
      if (method !== "NFC") {
        // (Future) handle QR/LINK
        return;
      }

      if (!nfcSupported) {
        setStatus("failed");
        setError("NFC not supported on this device/browser. Try another device.");
        return;
      }

      // Web NFC flow (Android Chrome). This only reads a tag and simulates a token.
      setStatus("waiting_nfc");

      // Prefer NDEFReader if available
      let cardToken = null;
      if ('NDEFReader' in window) {
        const ndef = new window.NDEFReader();
        await ndef.scan();
        ndef.onreadingerror = () => {
          setStatus("failed");
          setError("NFC read error. Please retry.");
        };
        ndef.onreading = async (event) => {
          // In a real flow you wouldn’t use raw card PAN, you’d use provider SDK to tokenize.
          // Here we just create a mock token from tag id/serial.
          cardToken = (event?.serialNumber || "mock-serial") + ":" + Date.now();
          await confirmPayment({ reference: pending.reference, cardToken });
        };
      } else if ('nfc' in navigator) {
        // Older experimental API path (rare). Fallback to mock.
        cardToken = "mock-fallback-" + Date.now();
        await confirmPayment({ reference: pending.reference, cardToken });
      } else {
        setStatus("failed");
        setError("NFC API not available.");
      }
    } catch {
      /* errors already handled */
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7FB] via-white to-[#E9FFF5]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white p-2 rounded-xl">
              <CreditCard size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A]">Accept a Payment</h1>
              <p className="text-gray-600">Tap to pay with NFC. Funds settle to your linked bank.</p>
            </div>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          {/* Amount + method */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (NGN)</label>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#0046A5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#0046A5] focus:outline-none"
              >
                <option value="NFC">Tap to Pay (NFC)</option>
                <option value="QR" disabled>QR Code (soon)</option>
                <option value="LINK" disabled>Payment Link (soon)</option>
              </select>
            </div>
          </div>

          {/* Note */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. POS sale at counter"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#00B86B] focus:outline-none"
            />
          </div>

          {/* Status / CTA */}
          <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield size={16} /> Card-present transaction • Encrypted • Bank settlement
            </div>
            <button
              onClick={handleTapToPay}
              disabled={status === "initiating" || status === "waiting_nfc" || status === "processing"}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white font-semibold shadow
                bg-gradient-to-r from-[#0046A5] to-[#00B86B] hover:opacity-95 transition"
            >
              {status === "initiating" || status === "waiting_nfc" || status === "processing" ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {status === "initiating" && "Starting..."}
                  {status === "waiting_nfc" && "Waiting for card..."}
                  {status === "processing" && "Processing..."}
                </>
              ) : (
                <>
                  <Nfc size={18} />
                  Tap to Pay
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Live status */}
          {status !== "idle" && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm">
                {status === "success" && <CheckCircle2 className="text-green-600" size={18} />}
                {status === "failed" && <XCircle className="text-red-600" size={18} />}
                <span className={
                  status === "success" ? "text-green-700" :
                  status === "failed" ? "text-red-700" : "text-gray-700"
                }>
                  {status === "initiating" && "Creating transaction..."}
                  {status === "waiting_nfc" && "Bring the card close to the device..."}
                  {status === "processing" && "Charging card..."}
                  {status === "success" && "Payment successful!"}
                  {status === "failed" && "Payment failed. Please retry."}
                </span>
              </div>
            </div>
          )}

          {/* Receipt preview */}
          {tx && (
            <div ref={captureRef} className="mt-6 border rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Receipt</h3>
                <span className="text-xs text-gray-500">{new Date().toLocaleString()}</span>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <div>Reference: <span className="font-mono">{tx.reference}</span></div>
                <div>Amount: <span className="font-semibold">₦{(tx.amount || 0).toLocaleString()}</span></div>
                <div>Status: <span className={`font-semibold ${tx.status === "success" ? "text-green-600" : "text-yellow-700"}`}>{tx.status}</span></div>
                {note && <div className="mt-1">Note: {note}</div>}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
