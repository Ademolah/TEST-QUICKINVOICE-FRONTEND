import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import copy from 'copy-to-clipboard';
import { motion } from 'framer-motion';
import { Copy, Download, Link as LinkIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API || 'http://localhost:4000';

export default function Payment() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('idle'); // idle | creating | ready | paid | failed
  const [error, setError] = useState('');
  const [recent, setRecent] = useState([]);
  const [banks, setBanks] = useState([]);
  const [bankLoaded, setBankLoaded] = useState(false);
  const qrRef = useRef(null);
  const token = useMemo(() => localStorage.getItem('token'), []);
  const navigate = useNavigate()

  useEffect(() => {
    loadBanks();
    loadRecent();
    ensureSubaccount();
    // eslint-disable-next-line
  }, []);

  async function loadBanks() {
    try {
      const res = await axios.get(`${API}/api/payments/banks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanks(res.data);
      setBankLoaded(true);
    } catch (e) {
      console.warn('banks load failed', e?.response?.data || e.message);
    }
  }

  async function loadRecent() {
    try {
      const { data } = await axios.get(`${API}/api/payments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecent(data || []);
    } catch (e) {
      // ignore
    }
  }

  async function ensureSubaccount() {
    try {
      // attempt to create subaccount idempotently
      await axios.post(`${API}/api/payments/onboard-bank`, {}, { headers: { Authorization: `Bearer ${token}` } });
      // call does require that user.accountDetails.bankCode exists; if you prefer auto-create use separate endpoint
    } catch (e) {
      // ignore - will surface if user hasn't onboarded bank
    }
  }

  const handleGenerate = async () => {
    setError('');
    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setStatus('creating');
    try {
      const { data } = await axios.post(`${API}/api/payments/create-link`, {
        amount: Number(amount),
        description,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setAuthUrl(data.authorization_url);
      setReference(data.reference);
      setStatus('ready');

      // start polling verification
      pollVerify(data.reference);
    } catch (e) {
      console.error(e?.response?.data || e.message);
      setError(e?.response?.data?.message || 'Failed to create payment link');
      setStatus('idle');
    }
  };

  const pollVerify = async (ref) => {
    const start = Date.now();
    const timeout = 120000; // 2 mins
    const tick = async () => {
      try {
        const { data } = await axios.get(`${API}/api/payments/verify/${ref}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const status = data?.data?.status || data?.status;
        if (status === 'success') {
          setStatus('paid');
          loadRecent();
          return;
        }
        if (status === 'failed') {
          setStatus('failed');
          loadRecent();
          return;
        }
      } catch (e) {
        // ignore
      }
      if (Date.now() - start < timeout) {
        setTimeout(tick, 3000);
      } else {
        // timed out
      }
    };
    tick();
  };

  const copyLink = () => {
    if (authUrl) {
      copy(authUrl);
      alert('Payment link copied to clipboard');
    }
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL();
    const link = document.createElement('a');
    link.download = `quickinvoice-qr-${reference || 'link'}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6FBFF] to-[#F0FFF4] p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0046A5]">Collect Payment</h1>
              <p className="text-gray-600 mt-1">Generate a secure payment link and QR code your customers can scan.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white px-4 py-2 rounded-xl">
              Live • QR & Link
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {error && <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>}

              <div>
                <label className="block text-sm text-gray-700 mb-1">Amount (NGN)</label>
                <input type="number" min="1" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#00B86B]" placeholder="e.g. 5000" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Description (optional)</label>
                <input value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#0046A5]" placeholder="Reason for payment" />
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={handleGenerate} disabled={status==='creating'} className={`flex-1 rounded-lg py-3 font-semibold text-white shadow ${status==='creating' ? 'bg-gray-400' : 'bg-gradient-to-r from-[#0046A5] to-[#00B86B]'}`}>
                  {status==='creating' ? <span className="flex items-center gap-2 justify-center"><Loader2 className="animate-spin" size={16} /> Creating…</span> : 'Generate Link & QR'}
                </button>
                <button onClick={()=>{ setAmount(''); setDescription(''); setAuthUrl(''); setReference(''); setStatus('idle'); }} className="px-4 rounded-lg border">Reset</button>
              </div>

              <div className="text-xs text-gray-500 mt-3">Payouts settle to your saved bank account. Ensure bank onboarding is complete.</div>
            </div>

            {/* QR + Link */}
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center">
              <div ref={qrRef} className="bg-white p-4 rounded-xl border">
                {authUrl ? <QRCodeCanvas value={authUrl} size={220} includeMargin /> : <div className="w-[220px] h-[220px] flex items-center justify-center text-gray-400">QR</div>}
              </div>

              <div className="w-full mt-4">
                <div className="flex items-center gap-2 bg-white border rounded-xl p-3">
                  <div className="truncate text-sm text-gray-800">{authUrl || 'No payment link generated yet'}</div>
                </div>

                <div className="flex gap-3 mt-3">
                  <button onClick={copyLink} disabled={!authUrl} className="flex-1 py-2 rounded-lg border inline-flex items-center justify-center gap-2">
                    <Copy size={14}/> Copy Link
                  </button>
                  <button onClick={downloadQR} disabled={!authUrl} className="flex-1 py-2 rounded-lg border inline-flex items-center justify-center gap-2">
                    <Download size={14}/> Download QR
                  </button>
                </div>

                <a target="_blank" rel="noreferrer" href={authUrl || '#'} className="mt-3 block text-center text-sm text-[#0046A5]">Open Checkout</a>

                <div className="mt-4">
                  {status==='ready' && <div className="py-2 px-3 rounded bg-amber-50 text-amber-700">Awaiting payment…</div>}
                  {status==='paid' && <div className="py-2 px-3 rounded bg-green-50 text-green-700 flex items-center gap-2"><CheckCircle2/> Payment received</div>}
                  {status==='failed' && <div className="py-2 px-3 rounded bg-red-50 text-red-700">Payment failed</div>}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent payments */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent payments</h3>
          {recent.length === 0 ? (
            <div className="text-gray-500">No payments yet</div>
          ) : (
            <div className="divide-y">
              {recent.slice(0,8).map(p => (
                <div key={p.reference} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-800 truncate">{p.description || 'Payment'}</div>
                    <div className="text-xs text-gray-500 truncate">{p.reference}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₦{Number(p.amount).toLocaleString()}</div>
                    <div className={`text-sm ${p.status==='success' ? 'text-green-600' : p.status==='failed' ? 'text-red-600' : 'text-amber-600'}`}>{p.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
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

