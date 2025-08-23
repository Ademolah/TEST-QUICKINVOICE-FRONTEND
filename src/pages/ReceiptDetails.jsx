import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";


// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function ReceiptDetails() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const captureRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const inv = await axios.get(`${API}/api/invoices/${invoiceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usr = await axios.get(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvoice(inv.data);
        setUser(usr.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [invoiceId]);

  // const downloadPDF = async () => {
  //   if (!captureRef.current) return;
    
  //   const logRes = await fetch(`${API}/api/invoices/log`, {
  //   method: "POST",
  //   headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`, // ensure token
  //   },
  //   body: JSON.stringify({ type: "receipt" }),
  //   });

  //   const logData = await logRes.json(); // ✅ now guaranteed JSON
  //   console.log("Usage log response:", logData);

  //   if (!logRes.ok) {
  //       alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
  //       return; // 🚨 Stop download here
  //       }

  //   const node = captureRef.current;
  //   const canvas = await html2canvas(node, { scale: 2, useCORS: true });
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "pt", "a4");
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const pageHeight = pdf.internal.pageSize.getHeight();

  //   const imgWidth = pageWidth - 48; // 24px margin each side
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   let y = 24;
  //   pdf.addImage(imgData, "PNG", 24, y, imgWidth, imgHeight);
  //   pdf.save(`Receipt_${invoice?._id?.slice(-6).toUpperCase()}.pdf`);
  // };

  const downloadPDF = async () => {
  if (!captureRef.current) return;

  // ✅ Log usage
  const logRes = await fetch(`${API}/api/invoices/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ type: "receipt" }),
  });

  const logData = await logRes.json();
  console.log("Usage log response:", logData);

  if (!logRes.ok) {
    alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
    return;
  }

  // ✅ Capture the receipt
  const node = captureRef.current;
  const canvas = await html2canvas(node, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 48; // margins
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 24; // first margin top

  // ✅ First page
  pdf.addImage(imgData, "PNG", 24, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - 48; // subtract content area

  // ✅ Add extra pages if needed
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 24;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 24, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`Receipt_${invoice?._id?.slice(-6).toUpperCase()}.pdf`);
};

  if (loading) return <div className="p-6 md:p-10">Loading receipt…</div>;
  if (!invoice || !user) return <div className="p-6 md:p-10">Not found.</div>;

  const { clientName, clientEmail, clientPhone, items = [], subtotal, tax, discount, total, createdAt } = invoice;
  const { businessName, email, phone, accountDetails } = user || {};
  // const { bankName, accountNumber, accountName } = accountDetails || {};

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-[#0046A5] border-[#0046A5] hover:bg-[#0046A5] hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={downloadPDF}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#0046A5] to-[#00B86B] hover:opacity-90 transition"
        >
          <Download size={16} /> Download PDF
        </button>
      </div>

      {/* Receipt Card (captured for PDF) */}
      <div
        ref={captureRef}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border"
        style={{
          borderColor: "#EBEEF2",
        }}
      >
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg font-bold">Q</div>
            <div>
              <h2 className="text-2xl font-bold">Receipt</h2>
              <p className="text-white/90 text-sm">QuickInvoice NG</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">Receipt No.</p>
            <p className="text-lg font-semibold">{invoice._id.slice(-6).toUpperCase()}</p>
            <p className="text-sm mt-1">
              {new Date(createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Business & Client */}
        <div className="p-8 grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4 border">
            <h3 className="font-semibold text-[#0046A5] mb-2">Issued By</h3>
            <p className="font-medium">{businessName}</p>
            <p className="text-sm text-gray-600">{email}</p>
            {phone && <p className="text-sm text-gray-600">+{phone}</p>}
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border">
            <h3 className="font-semibold text-[#0046A5] mb-2">Issued To</h3>
            <p className="font-medium">{clientName}</p>
            {clientEmail && <p className="text-sm text-gray-600">{clientEmail}</p>}
            {clientPhone && <p className="text-sm text-gray-600">{clientPhone}</p>}
          </div>
        </div>

        {/* Items Table */}
        <div className="px-8">
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Qty</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Unit Price</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-3">{it.description}</td>
                    <td className="px-4 py-3">{it.quantity}</td>
                    <td className="px-4 py-3">₦{Number(it.unitPrice).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium">₦{Number(it.total ?? it.quantity * it.unitPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="p-8 grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="text-green-600 shrink-0" />
            <div>
              <h4 className="font-semibold text-green-700">Payment Confirmed</h4>
              <p className="text-sm text-green-700/80">
                This receipt confirms the payment for the items listed. Thank you for your business!
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₦{Number(subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">₦{Number(tax || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium">₦{Number(discount || 0).toLocaleString()}</span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between">
              <span className="font-semibold text-[#0046A5]">Grand Total</span>
              <span className="font-bold text-[#0046A5]">₦{Number(total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        {/* {(bankName || accountNumber || accountName) && (
          <div className="px-8 pb-8">
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold text-[#0046A5] mb-2">Account Details</h3>
              {bankName && <p className="text-sm text-gray-700">Bank: {bankName}</p>}
              {accountNumber && <p className="text-sm text-gray-700">Account Number: {accountNumber}</p>}
              {accountName && <p className="text-sm text-gray-700">Account Name: {accountName}</p>}
            </div>
          </div>
        )} */}

        {/* Footer */}
        <div className="px-8 pb-8">
          <p className="text-xs text-gray-500">
            Generated by QuickInvoice NG — {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
