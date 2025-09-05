import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle } from "lucide-react";

export default function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [form, setForm] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    receiverName: "",
    receiverPhone: "",
  });

  const fetchDeliveries = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:4000/api/deliveries", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeliveries(res.data);
  };

  const createDelivery = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:4000/api/deliveries", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({
      pickupAddress: "",
      deliveryAddress: "",
      receiverName: "",
      receiverPhone: "",
    });
    fetchDeliveries();
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-[#0046A5] mb-6"
      >
        🚚 Delivery Management
      </motion.h1>

      {/* Form */}
      <form
        onSubmit={createDelivery}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-lg rounded-2xl p-6 mb-6"
      >
        <input
          type="text"
          placeholder="Pickup Address"
          value={form.pickupAddress}
          onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
          className="p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Delivery Address"
          value={form.deliveryAddress}
          onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
          className="p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Receiver Name"
          value={form.receiverName}
          onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
          className="p-3 border rounded-lg"
          required
        />
        <input
          type="tel"
          placeholder="Receiver Phone"
          value={form.receiverPhone}
          onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })}
          className="p-3 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="col-span-2 bg-[#00B86B] text-white py-3 rounded-xl font-semibold hover:opacity-90"
        >
          Create Delivery
        </button>
      </form>

      {/* Delivery List */}
      <div className="grid gap-4">
        {deliveries.map((d) => (
          <motion.div
            key={d._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold text-lg text-[#0046A5]">
                {d.pickupAddress} → {d.deliveryAddress}
              </h2>
              <p className="text-sm text-gray-600">
                Receiver: {d.receiverName} ({d.receiverPhone})
              </p>
            </div>
            <div className="flex items-center gap-2">
              {d.status === "pending" && <Package className="text-gray-500" />}
              {d.status === "in_transit" && <Truck className="text-[#0046A5]" />}
              {d.status === "delivered" && (
                <CheckCircle className="text-[#00B86B]" />
              )}
              <span className="capitalize text-sm font-medium">{d.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
