import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const API =  "http://localhost:4000";

const API = "https://quickinvoice-backend-1.onrender.com"

export default function Client() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClients(res.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Clients</h1>
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-[#0046A5]">
          <tr>
            <th className="p-2 text-left text-white">Name</th>
            <th className="p-2 text-left text-white">Phone</th>
            <th className="p-2 text-left text-white">Email</th>
            <th className="p-2 text-left text-white">Paid Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{client.name}</td>
              <td className="p-2">{client.phone}</td>
              <td className="p-2">{client.email}</td>
              <td className="p-2">
                {client.paid_status ? (
                  <span className="text-green-600 font-medium">Paid</span>
                ) : (
                  <span className="text-red-600 font-medium">Unpaid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
