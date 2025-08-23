// src/pages/PaymentCallback.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:4000';

export default function PaymentCallback(){
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const ref = searchParams.get('reference') || searchParams.get('trxref') || '';
    if (!ref) {
      setStatus('no-ref');
      return;
    }
    const token = localStorage.getItem('token');
    axios.get(`${API}/api/payments/verify/${ref}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => {
      setStatus('success');
      setTimeout(() => navigate('/billing?status=success'), 1200);
    }).catch(e => {
      console.error(e);
      setStatus('failed');
      setTimeout(() => navigate('/billing?status=failed'), 1200);
    });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === 'verifying' && <p>Verifying payment…</p>}
      {status === 'success' && <p>Payment successful! Redirecting…</p>}
      {status === 'failed' && <p>Payment failed. Redirecting…</p>}
      {status === 'no-ref' && <p>No payment reference found.</p>}
    </div>
  );
}
