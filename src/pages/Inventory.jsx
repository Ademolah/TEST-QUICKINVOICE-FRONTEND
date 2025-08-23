

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import PremiumTrashButton from "../components/ui/Delete";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  Tag,
  Hash,
  Layers,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =========================
   Inline UI Primitives
   ========================= */

// Brand Button

const Button = ({ className = "", children, ...props }) => (
  <button
    className={
      "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all " +
      "bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white shadow hover:shadow-md hover:opacity-95 active:scale-[0.98] " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

// Subtle/ghost button
const GhostButton = ({ className = "", children, ...props }) => (
  <button
    className={
      "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium transition-colors " +
      "text-[#0046A5] hover:bg-[#0046A5]/10 " +
      className
    }
    {...props}
  >
    {children}
  </button>
);


// Card
const Card = ({ className = "", children }) => (
  <div className={"bg-white rounded-2xl shadow-md border border-gray-100 " + className}>
    {children}
  </div>
);
const CardHeader = ({ children, className = "" }) => (
  <div className={"p-5 border-b border-gray-100 " + className}>{children}</div>
);
const CardContent = ({ children, className = "" }) => (
  <div className={"p-5 " + className}>{children}</div>
);

// Dialog / Modal
const Dialog = ({ open, onClose, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
          >
            <div
              className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* =========================
   Helpers
   ========================= */
const NGN = (n) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(
    Number(n || 0)
  );

// const api = axios.create({
//   baseURL: "http://localhost:4000/api",
// });

const api = axios.create({
  baseURL: "https://quickinvoice-backend-1.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* =========================
   Inventory Page
   ========================= */
export default function Inventory() {
    
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  

  
  const [query, setQuery] = useState("");

  // Modal state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // 'create' | 'edit'
  const [form, setForm] = useState({
    _id: null,
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });

  // Fetch inventory
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory");
      setItems(res.data || []);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Derived stats
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name?.toLowerCase().includes(q) ||
        i.sku?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const totals = useMemo(() => {
    const totalProducts = filtered.length;
    const totalUnits = filtered.reduce((s, it) => s + Number(it.stock || 0), 0);
    const totalValue = filtered.reduce(
      (s, it) => s + Number(it.stock || 0) * Number(it.price || 0),
      0
    );
    return { totalProducts, totalUnits, totalValue };
  }, [filtered]);

  // Handlers
  const openCreate = () => {
    setMode("create");
    setForm({
      _id: null,
      name: "",
      sku: "",
      price: "",
      stock: "",
      category: "",
      description: "",
    });
    setOpen(true);
  };

  const categories = ["Gadgets", "Fashion", "Medicine", "Furniture", "Restaurant"];

  const openEdit = (item) => {
    setMode("edit");
    setForm({
      _id: item._id,
      name: item.name || "",
      sku: item.sku || "",
      price: item.price ?? "",
      stock: item.stock ?? "",
      category: item.category || "",
      description: item.description || "",
    });
    setOpen(true);
  };

  const saveItem = async () => {
    // basic validation
    if (!form.name || !String(form.price).length || !String(form.stock).length) {
      setError("Please fill Name, Price and Quantity.");
      return;
    }
    // if (!form.name.trim() || form.price === "" || form.quantity === "") {
    // setError("Please fill Name, Price and Quantity.");
    // return;
    // }
    try {
      setError("");
      if (mode === "create") {
        const res = await api.post("/inventory", {
          name: form.name,
          sku: form.sku,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          description: form.description,
        });
        setItems((prev) => [res.data, ...prev]);
      } else {
        const res = await api.put(`/inventory/${form._id}`, {
          name: form.name,
          sku: form.sku,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          description: form.description,
        });
        setItems((prev) => prev.map((it) => (it._id === form._id ? res.data : it)));
      }
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Save failed");
    }
  };

  const deleteItem = async (id) => {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;
    try {
      setBusyId(id);
      await api.delete(`/inventory/${id}`);
      setItems((prev) => prev.filter((it) => it._id !== id));
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0046A5] via-[#00B86B] to-[#0046A5] opacity-90" />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-7xl mx-auto px-6 py-10"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Inventory</h1>
              <p className="text-white/80 mt-2">
                Track products, stock levels, and values in one place.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#4B5563" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, SKU, category…"
                  className="pl-10 pr-4 py-2 rounded-xl bg-white/90 backdrop-blur text-gray-800 placeholder:text-gray-500 shadow-md w-[260px] md:w-[320px] focus:outline-none focus:ring-2 focus:ring-white/60"
                />
              </div>
              <Button onClick={openCreate} className="whitespace-nowrap">
                <Plus size={18} /> Add Product
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#0046A5]/10">
                  <Package className="text-[#0046A5]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-2xl font-bold text-gray-800">{totals.totalProducts}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#00B86B]/10">
                  <Layers className="text-[#00B86B]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Units in Stock</p>
                  <p className="text-2xl font-bold text-gray-800">{totals.totalUnits}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-100">
                  <Tag className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Value</p>
                  <p className="text-2xl font-bold text-gray-800">{NGN(totals.totalValue)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading inventory…</div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-gray-600 mb-6">No products found.</p>
              <Button onClick={openCreate}>
                <Plus size={18} /> Add your first product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full">
                    <CardHeader className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">SKU: {item.sku || "—"}</p>
                      </div>
                      <div className="flex gap-2">
                        <GhostButton onClick={() => openEdit(item)} title="Edit">
                          <Pencil size={18} />
                        </GhostButton>
                        <GhostButton
                          onClick={() => deleteItem(item._id)}
                          title="Delete"
                          className="text-red-600 hover:bg-red-50"
                        >
                          {busyId === item._id ? (
                            <svg
                              className="animate-spin h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                          ) : (
                            <Trash2  size={18} />
                          )}
                        </GhostButton>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Category</span>
                        <span className="font-medium">{item.category || "—"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Price</span>
                        <span className="font-semibold">{NGN(item.price)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Stock</span>
                        <span className="font-semibold">{item.stock}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          {item.description?.length ? item.description : "No description"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h3>
          <GhostButton onClick={() => setOpen(false)}>
            <X size={18} />
          </GhostButton>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Product Name"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder="e.g., iPhone 15 Pro"
              required
            />
            <Field
              label="SKU"
              value={form.sku}
              onChange={(v) => setForm((f) => ({ ...f, sku: v }))}
              placeholder="e.g., IP15-256-GRY"
              icon={<Hash size={16} />}
            />
            <Field
              label="Price (NGN)"
              type="number"
              value={form.price}
              onChange={(v) => setForm((f) => ({ ...f, price: v }))}
              placeholder="e.g., 250000"
              required
            />
            <Field
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(v) => setForm((f) => ({ ...f, stock: v }))}
              placeholder="e.g., 10"
              required
            />
            {/* <Field
              label="Category"
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
              placeholder="e.g., Phones"
            /> */}

            <select
    value={form.category}
    onChange={(e) =>
      setForm((f) => ({ ...f, category: e.target.value }))
    }
    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">-- Select Category --</option>
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>

    

            <Field
              label="Description"
              value={form.description}
              onChange={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="Optional notes…"
              textarea
              className="md:col-span-2"
            />
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 border border-red-100">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <Button onClick={saveItem}>{mode === "create" ? "Add Product" : "Save Changes"}</Button>
          </div>
        </div>
      </Dialog>

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

/* =========================
   Reusable Field Component
   ========================= */
const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  textarea = false,
  className = "",
  icon = null,
}) => {
  const base =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-gray-800 placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-[#0046A5]/30 focus:border-[#0046A5]/40";
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
        {textarea ? (
          <textarea
            className={base + (icon ? " pl-9" : "")}
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <input
            className={base + (icon ? " pl-9" : "")}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )}

        
      </div>

    </div>
    
  );
};