import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText, Search, ReceiptText } from "lucide-react";

// const brandBlue = "#0046A5";
// const brandGreen = "#00B86B";


// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Receipts() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Only PAID invoices are receipt-ready
        setInvoices(res.data.filter((i) => i.status === "paid"));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return invoices.slice(0, 10);
    return invoices
      .filter(
        (i) =>
          i.clientName?.toLowerCase().includes(q) ||
          i.clientEmail?.toLowerCase().includes(q) ||
          i._id?.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [invoices, query]);

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-[color:var(--brandBlue,#0046A5)] font-semibold">
          Loading receipts…
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white px-3 py-2 rounded-lg">
            <ReceiptText size={20} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0046A5]">
            Receipts
          </h1>
        </div>

        <div className="relative w-full max-w-xs">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client or invoice #"
            className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Invoice #</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Client</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Total</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-gray-500 text-center">
                    No paid invoices yet.
                  </td>
                </tr>
              )}
              {filtered.map((inv) => (
                <tr key={inv._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{inv._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3">{inv.clientName}</td>
                  <td className="px-4 py-3">₦{Number(inv.total).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {new Date(inv.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/receipts/${inv._id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#0046A5] to-[#00B86B] hover:opacity-90 transition"
                    >
                      <FileText size={16} />
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer hint */}
        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500">
          Showing up to 10 receipts. Use search to find more.
        </div>
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
