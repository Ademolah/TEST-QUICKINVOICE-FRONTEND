import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash } from 'lucide-react';


const API =  "http://localhost:4000";

// const API = "https://quickinvoice-backend-1.onrender.com"

const NewInvoice = () => {
  const navigate = useNavigate();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: '', unitPrice: '' }]);
  // const [tax, setTax] = useState(0);
  const [tax, setTax] = useState('');
  // const [discount, setDiscount] = useState(0);
const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'description' ? value : Number(value);
    setItems(updated);
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const total = Math.max(0, subtotal + Number(tax) - Number(discount));

  console.log('Total at new invoice ',total)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || items.length === 0) {
      setError('Client name and at least one item are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/api/invoices`,
        { clientName, clientEmail, clientPhone, items, tax, discount, dueDate, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/invoices/${response.data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0046A5] mb-6">Create New Invoice</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
        {/* Client Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="email"
            placeholder="Client Email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Client Phone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Invoice Items */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Items</h2>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="grid md:grid-cols-4 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />

                {/* <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity }
                  min={1}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                /> */}
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Quantity"
                  value={item.quantity === '' ? '' : item.quantity}
                  min={1}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />

                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  min={0}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
                <div className="flex gap-2 items-center">
                  <span className="text-gray-700 font-semibold">
                    {item.quantity * item.unitPrice}
                  </span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} className="text-red-500">
                      <Trash size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-2 inline-flex items-center gap-2 text-[#0046A5] font-semibold"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>

        {/* Tax, Discount, Due Date, Notes */}
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="number"
            placeholder="Tax"
            value={tax}
            min={0}
            onChange={(e) => setTax(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Discount"
            value={discount}
            min={0}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Total */}
        <div className="text-right font-bold text-xl">
          Total: <span className="text-[#0046A5]">{total.toLocaleString()}</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0046A5] hover:bg-[#0056c0] text-white font-semibold py-3 px-6 rounded-lg shadow transition-all duration-300"
        >
          {loading ? 'Creating...' : 'Create Invoice'}
        </button>
      </form>

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

export default NewInvoice;
