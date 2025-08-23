


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Sidebar from "../components/Sidebar"; // Adjust path if needed
import {Menu, X} from 'lucide-react'

// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

const Dashboard = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({
    totalInvoicesThisMonth: 0,
    totalRevenue: 0,
    totalUnpaid: 0,
    totalSales: 0,
    totalQuantity: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch invoices
        const invoiceRes = await axios.get(`${API}/api/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const invoicesData = invoiceRes.data;

        // Fetch user (business name)
        const userRes = await axios.get(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusinessName(userRes.data.businessName || '');

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter invoices for this month
        const invoicesThisMonth = invoicesData.filter(inv => {
          const invDate = new Date(inv.createdAt);
          return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
        });

        const totalInvoicesThisMonth = invoicesThisMonth.length;
        const totalRevenue = invoicesThisMonth
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + inv.total, 0);
        const totalUnpaid = invoicesThisMonth.filter(inv => inv.status !== 'paid').length;
        const totalSales = invoicesThisMonth.reduce((sum, inv) => sum + inv.total, 0);
        const totalQuantity = invoicesThisMonth.reduce(
          (sum, inv) => sum + inv.items.reduce((itemSum, it) => itemSum + it.quantity, 0),
          0
        );

        setInvoices(invoicesThisMonth);
        setStats({
          totalInvoicesThisMonth,
          totalRevenue,
          totalUnpaid,
          totalSales,
          totalQuantity,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = invoices.map(inv => ({
    date: new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    Paid: inv.status === 'paid' ? inv.total : 0,
    Unpaid: inv.status !== 'paid' ? inv.total : 0,
  }));

  if (loading) {
    return (
      <div className="flex">
        <Sidebar className="fixed h-screen" />
        <div className="ml-[250px] flex-1 p-6">
          <div className="text-center mt-10 text-[#0046A5] font-semibold">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <div className="sm:hidden md:block fixed h-screen w-[250px]  ">
        <Sidebar />
      </div>    


      {/* Mobile Sidebar (Drawer) */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[250px] bg-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <Sidebar />
      </div> 



      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 space-y-6 max-w-7xl w-full md:ml-[250px]">
        <h1 className="text-3xl font-bold text-[#0046A5] mb-6">
          Welcome to {businessName}
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Invoices This Month</h2>
            <p className="text-2xl font-bold">{stats.totalInvoicesThisMonth}</p>
          </div>

          <div className="bg-gradient-to-r from-[#50D6FE] to-[#0046A5] text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Revenue (Paid)</h2>
            <p className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-r from-[#00B86B] to-[#0046A5] text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Unpaid Invoices</h2>
            <p className="text-2xl font-bold">{stats.totalUnpaid}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-2 text-[#0046A5]">Total Sales</h2>
            <p className="text-xl font-bold">₦{stats.totalSales.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-2 text-[#0046A5]">Total Goods Sold</h2>
            <p className="text-xl font-bold">{stats.totalQuantity}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-[#0046A5]">Sales Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="Paid" fill="#0046A5" />
              <Bar dataKey="Unpaid" fill="#00B86B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
      {children}
    </div>
  );
};

export default Dashboard;
