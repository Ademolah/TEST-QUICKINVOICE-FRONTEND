import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash } from 'lucide-react';

const NewInvoice = () => {
  const navigate = useNavigate();

  // INIT AS EMPTY STRINGS SO PLACEHOLDERS SHOW
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: '', unitPrice: '' }]);
  const [tax, setTax] = useState('');        // <- ''
  const [discount, setDiscount] = useState(''); // <- ''
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleItemChange = (index, field, raw) => {
    const updated = [...items];
    // keep '' if user clears field; otherwise store Number for math
    const value = field === 'description'
      ? raw
      : raw === '' ? '' : Number(raw);
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () =>
    setItems([...items, { description: '', quantity: '', unitPrice: '' }]);

  const removeItem = (index) =>
    setItems(items.filter((_, i) => i !== index));

  // Safely coerce to numbers for calculations
  const numericItems = items.map(it => ({
    ...it,
    quantity: Number(it.quantity || 0),
    unitPrice: Number(it.unitPrice || 0),
  }));

  const subtotal = numericItems.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const numericTax = Number(tax || 0);
  const numericDiscount = Number(discount || 0);
  const total = Math.max(0, subtotal + numericTax - numericDiscount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || items.length === 0) {
      setError('Client name and at least one item are required.');
      return;
    }

    // Build payload with numbers; include dueDate only if present
    const payload = {
      clientName,
      clientEmail,
      clientPhone,
      items: numericItems.map(({ description, quantity, unitPrice }) => ({
        description: description.trim(),
        quantity,
        unitPrice,
      })),
      tax: numericTax,
      discount: numericDiscount,
      notes,
    };
    if (dueDate) payload.dueDate = dueDate; // ISO string is fine for mongoose Date

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:4000/api/invoices', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/invoices/${res.data._id}`);
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

        {/* Items */}
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
                  inputMode="decimal"
                  placeholder="Unit Price"
                  value={item.unitPrice === '' ? '' : item.unitPrice}
                  min={0}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
                <div className="flex gap-2 items-center">
                  <span className="text-gray-700 font-semibold">
                    {(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toLocaleString()}
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
            inputMode="decimal"
            placeholder="Tax"
            value={tax === '' ? '' : tax}
            min={0}
            onChange={(e) => setTax(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            inputMode="decimal"
            placeholder="Discount"
            value={discount === '' ? '' : discount}
            min={0}
            onChange={(e) => setDiscount(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
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

        {/* Totals */}
        <div className="text-right font-bold text-xl">
          Total: <span className="text-[#0046A5]">₦{total.toLocaleString()}</span>
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
    </div>
  );
};

export default NewInvoice;
