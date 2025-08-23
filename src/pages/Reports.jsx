

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Cards";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  Loader2,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const [statsRes, invoicesRes] = await Promise.all([
          axios.get(`${API}/api/reports`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/api/invoices`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(statsRes.data);
        setInvoices(invoicesRes.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filter invoices by selected month
  const filteredInvoices = React.useMemo(() => {
    if (!selectedMonth) return invoices;
    const [year, month] = selectedMonth.split("-");
    return invoices.filter((inv) => {
      const invDate = new Date(inv.createdAt);
      return (
        invDate.getFullYear() === parseInt(year) &&
        invDate.getMonth() + 1 === parseInt(month)
      );
    });
  }, [selectedMonth, invoices]);

  // Recalculate stats based on filtered invoices
  const dynamicStats = React.useMemo(() => {
    if (!filteredInvoices.length) return stats;

    const invoiceCount = filteredInvoices.length;
    const paidInvoices = filteredInvoices.filter(
      (i) => i.status === "paid"
    ).length;
    const pendingInvoices = filteredInvoices.filter(
      (i) => i.status === "sent"
    ).length;
    const totalRevenue = filteredInvoices
      .filter((i) => i.status === "paid")
      .reduce((acc, i) => acc + i.total, 0);

    return { invoiceCount, paidInvoices, pendingInvoices, totalRevenue };
  }, [filteredInvoices, stats]);

  // Revenue trend data (per month)
  const revenueData = React.useMemo(() => {
    return invoices
      .filter((i) => i.status === "paid")
      .map((i) => {
        const date = new Date(i.createdAt);
        return {
          month: `${date.getFullYear()}-${date.getMonth() + 1}`,
          revenue: i.total,
        };
      })
      .reduce((acc, curr) => {
        const existing = acc.find((a) => a.month === curr.month);
        if (existing) {
          existing.revenue += curr.revenue;
        } else {
          acc.push(curr);
        }
        return acc;
      }, []);
  }, [invoices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Failed to load report data.
      </div>
    );
  }

  const data = [
    { name: "Invoices", value: dynamicStats.invoiceCount },
    { name: "Paid", value: dynamicStats.paidInvoices },
    { name: "Pending", value: dynamicStats.pendingInvoices },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">
            Overview of your Business performance and revenue
          </p>
        </div>

        {/* Month Filter */}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded-lg px-3 py-2 text-gray-600 mt-4 md:mt-0"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-t-4 border-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileText className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dynamicStats.invoiceCount}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{dynamicStats.totalRevenue?.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Paid Invoices
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dynamicStats.paidInvoices}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-t-4 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dynamicStats.pendingInvoices}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Invoice Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0046A5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Trend Line Chart */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0046A5"
                strokeWidth={3}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
};

export default Reports;


