

// src/pages/InvoiceDetails.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  Edit3,
  Trash2,
  Loader2,
} from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

/**
 * Premium InvoiceDetails.jsx
 * - Fetches invoice and user
 * - Renders premium invoice
 * - Downloads pixel-perfect PDF with html2canvas + jsPDF
 */

// const API_BASE = "http://localhost:4000";

const API_BASE = "https://quickinvoice-backend-1.onrender.com"


// const currencyFmt = (amt = 0) =>
//   `₦${Number(amt || 0).toLocaleString("en-NG")}`;


export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);



  const { code, symbol } = useCurrency(); // 👈 get currency settings

  // helper to format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code,
    }).format(amount);

    const AccountDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/users/account-details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      setBankName(res.data.accountDetails.bankName || '');
      setAccountNumber(res.data.accountDetails.accountNumber || '');
      setAccountName(res.data.accountDetails.accountName || '');
    } catch (err) {
      console.error('Error fetching account details:', err);
    }
  };

  useEffect(() => {
    AccountDetails(); // Call it on component mount
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        if (!token) {
          setError("Authentication required");
          return;
        }

        const [invRes, userRes] = await Promise.all([
          axios.get(`${API_BASE}/api/invoices/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setInvoice(invRes.data);
        setUser(userRes.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, token]);

//  const sharePDF = async () => {
//   if (!invoiceRef.current) return;
  

//   try {
//     // ✅ Log usage (same as download)
//     const logRes = await fetch(`${API_BASE}/api/invoices/log`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({ type: "invoice" }),
//     });

//     const logData = await logRes.json();
//     console.log("Usage log response:", logData);

//     if (!logRes.ok) {
//       alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
//       return; // 🚨 Stop here
//     }

//     // ✅ Capture as before
//     const canvas = await html2canvas(invoiceRef.current, {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true,
//       scrollY: -window.scrollY,
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     const margin = 12;
//     const imgWidth = pageWidth - margin * 2;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     let position = margin;
//     pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);

//     let heightLeft = imgHeight - (pageHeight - margin * 2);
//     while (heightLeft > -1) {
//       pdf.addPage();
//       position = margin - (imgHeight - heightLeft);
//       pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight - margin * 2;
//     }

//     // ✅ Convert PDF to blob and share
//     const pdfBlob = pdf.output("blob");
//     const file = new File([pdfBlob], `Invoice-${id}.pdf`, {
//       type: "application/pdf",
//     });

//     if (navigator.canShare && navigator.canShare({ files: [file] })) {
//       await navigator.share({
//         title: "QuickInvoice Invoice",
//         text: `Here is your invoice #${id}`,
//         files: [file],
//       });
//     } else {
//       alert("Sharing not supported on this device/browser. Please download instead.");
//     }
//   } catch (err) {
//     console.error("PDF share failed", err);
//     alert("Failed to share PDF. Try again.");
//   } 
// };

const sharePDF = async () => {
  if (!invoiceRef.current) return;
  setActionLoading(true);

  try {
    // ✅ Log usage
    const logRes = await fetch(`${API_BASE}/api/invoices/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ type: "invoice" }),
    });

    const logData = await logRes.json();
    console.log("Usage log response:", logData);

    if (!logRes.ok) {
      alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
      setActionLoading(false);
      return;
    }

    // ✅ Capture invoice as before
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 12;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = margin;
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);

    let heightLeft = imgHeight - (pageHeight - margin * 2);
    while (heightLeft > -1) {
      pdf.addPage();
      position = margin - (imgHeight - heightLeft);
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    // ✅ Convert PDF to blob & file
    const pdfBlob = pdf.output("blob");
    const fileName = `Invoice-${id}.pdf`;
    const file = new File([pdfBlob], fileName, { type: "application/pdf" });

    // ✅ Try Web Share API first
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "QuickInvoice Invoice",
        text: `Here is your invoice #${id}`,
        files: [file],
      });
    } else {
      // 🚨 Fallback: Download PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optional: WhatsApp / Email fallback
      // window.open(`https://wa.me/?text=Here’s your invoice: ${pdfUrl}`, "_blank");
      // window.location.href = `mailto:?subject=Invoice&body=Download your invoice here: ${pdfUrl}`;

      alert("Sharing not supported on this device. The invoice has been downloaded instead.");
    }
  } catch (err) {
    console.error("PDF share failed", err);
    alert("Failed to share PDF. Try again.");
  } finally {
    setActionLoading(false);
  }
};




  const downloadPDF = async () => {

    if (!invoiceRef.current) return;
    setActionLoading(true);
    try {

      //   // ✅ Temporarily expand the table so all columns fit before capture
      // const scrollContainer = invoiceRef.current.querySelector(".overflow-x-auto");
      // const originalStyle = scrollContainer.style.overflowX;
      // scrollContainer.style.overflowX = "visible"; // disable scroll

        const logRes = await fetch(`${API_BASE}/api/invoices/log`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ensure token
        },
        body: JSON.stringify({ type: "invoice" }),
        });

        const logData = await logRes.json(); // ✅ now guaranteed JSON
        console.log("Usage log response:", logData);

        if (!logRes.ok) {
        alert(logData.message || "You have exceeded your limit. Upgrade to Pro.");
        return; // 🚨 Stop download here
        }



      // Increase scale to keep crispness
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY, // avoid scroll offset
       
      });

      

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // convert px -> mm: width_mm = px * 25.4 / dpi. html2canvas default 96dpi; but we used scale to 2 for crispness.
      // simpler approach: fit image to pageWidth with margin
      const margin = 12; // mm
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = margin;
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);

      // If content larger than one page, add pages
      let heightLeft = imgHeight - (pageHeight - margin * 2);
      while (heightLeft > -1) {
        pdf.addPage();
        position = margin - (imgHeight - heightLeft);
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      pdf.save(`Invoice-${id}.pdf`);
    } catch (err) {
      console.error("PDF download failed", err);
      alert("Failed to generate PDF. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  

  const handleMarkPaid = async () => {
    if (!window.confirm("Mark invoice as paid?")) return;
    try {
      setActionLoading(true);
      const res = await axios.patch(
        `${API_BASE}/api/invoices/${id}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvoice(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to mark as paid");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this invoice? This cannot be undone.")) return;
    try {
      setActionLoading(true);
      await axios.delete(`${API_BASE}/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/invoices");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete invoice");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-10 h-10 text-[#0046A5] animate-spin" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-red-600 font-semibold mb-4">{error || "Invoice not found"}</p>
          <button
            onClick={() => navigate("/invoices")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0046A5] text-white"
          >
            <ArrowLeft size={16} />
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  // invoice fields based on your model: items: [{description, quantity, unitPrice, total}], subtotal, tax, discount, total, status, dueDate, notes
  const {
    clientName,
    clientEmail,
    clientPhone,
    items = [],
    subtotal,
    tax,
    discount,
    total,
    status,
    createdAt,
    dueDate,
    notes,
  } = invoice;

  // const accountDetails = user?.accountDetails || {};
  
  

  const statusClass =
    status === "paid"
      ? "bg-green-100 text-green-800"
      : status === "overdue"
      ? "bg-red-100 text-red-800"
      : status === "sent"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0046A5]">Invoice Details</h1>
            <p className="text-sm text-gray-600 mt-1">{user?.businessName || "Your Business"}</p>
          </div>

          <div className="flex items-center gap-3">
            {status && (
              <span className={`px-3 py-2 rounded-full font-semibold ${statusClass}`}>
                {status.toUpperCase()}
              </span>
            )}

            {status !== "paid" && (
              <button
                onClick={handleMarkPaid}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00B86B] text-white hover:brightness-105 disabled:opacity-60"
              >
                <CheckCircle2 size={18} />
                {actionLoading ? "Processing..." : "Mark as Paid"}
              </button>
            )}

            <button onClick={sharePDF} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-[#0046A5] to-[#00B86B] hover:opacity-90 transition"
            variant="secondary">
              Share
              </button>

            <button
              onClick={downloadPDF}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white hover:opacity-95 disabled:opacity-60"
            >
              <Download size={18} />
              {actionLoading ? "Preparing..." : "Download PDF"}
            </button>

            {/* <button
              onClick={() => navigate(`/invoices/${id}/edit`)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200"
            >
              <Edit3 size={16} />
              Edit
            </button> */}

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Invoice card that will be captured for PDF */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" ref={invoiceRef}>
          {/* Premium gradient header */}
          <div className="p-6 bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-md font-bold">Q</div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold">Invoice</h2>
                  <p className="text-sm opacity-90 font-semibold">{user?.businessName ? user?.businessName : "QuickInvoice NG"}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm opacity-90">Invoice</p>
                <p className="text-xl font-semibold">{String(id).slice(-8).toUpperCase()}</p>
                <p className="text-sm mt-1">{new Date(createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* From / To */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-[#0046A5]">From</h3>
                <p className="font-bold text-gray-800">{user?.businessName || "-"}</p>
                {user?.email && <p className="text-sm text-gray-600">{user.name}</p>}
                {user?.phone && <p className="text-sm text-gray-600">+{user.phone}</p>}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0046A5]">Billed To</h3>
                <p className="font-semibold text-gray-800">{clientName || "-"}</p>
                {clientEmail && <p className="text-sm text-gray-600">{clientEmail}</p>}
                {clientPhone && <p className="text-sm text-gray-600">{clientPhone}</p>}
                <div className="mt-2 text-sm">
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium">{dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Items table */}
            <div className="overflow-x-auto  rounded-xl border">
              {/* <table className="w-full min-w-[600px]"> */}
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm text-gray-600">Description</th>
                    <th className="text-right px-4 py-3 text-sm text-gray-600">Qty</th>
                    <th className="text-right px-4 py-3 text-sm text-gray-600">Unit Price</th>
                    <th className="text-right px-4 py-3 text-sm text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-800">{it.description}</td>
                      <td className="px-4 py-4 text-right text-sm">{it.quantity}</td>
                      <td className="px-4 py-4 text-right text-sm">{formatCurrency(it.unitPrice)}</td>
                      <td className="px-4 py-4 text-right font-semibold">{formatCurrency(it.total ?? it.quantity * it.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {notes && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="text-sm text-gray-600 mb-1">Notes</h4>
                <p className="text-sm text-gray-800">{notes}</p>
              </div>
            )}

            {/* Summary & Account */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="text-sm text-gray-600 mb-2">Payment Info</h4>
                <p className="text-sm text-gray-700">Bank: {bankName || "-"}</p>
                <p className="text-sm text-gray-700">Account Number: {accountNumber || "-"}</p>
                <p className="text-sm text-gray-700">Account Name: {accountName || "-"}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 self-start">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  {/* <span className="font-medium">{currencyFmt(subtotal)}</span> */}
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="font-medium">{formatCurrency(discount)}</span>
                </div>

                <div className="h-px bg-gray-200 my-2" />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#0046A5]">Total</span>
                  <span className="text-xl font-extrabold text-[#0046A5]">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>QuickInvoice NG — thank you for your business!</p>
            </div>
          </div>
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


