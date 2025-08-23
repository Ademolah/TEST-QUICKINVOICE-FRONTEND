import React, { useState } from 'react'

export default function AuthForm({ onSubmit, fields, cta }){
  const [form, setForm] = useState(Object.fromEntries(fields.map(f=> [f.name, ''])))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async (e)=>{
    e.preventDefault()
    setLoading(true); setError('')
    try { await onSubmit(form) } catch (e) { setError(e.message || 'Something went wrong') } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handle} className="bg-white rounded-2xl p-6 shadow-soft w-full max-w-md mx-auto">
      <h3 className="font-heading text-xl text-primary mb-4">{cta}</h3>
      {fields.map(f => (
        <div key={f.name} className="mb-3">
          <label className="block text-sm text-textGray mb-1">{f.label}</label>
          <input type={f.type || 'text'} required={f.required !== false}
            value={form[f.name]}
            onChange={e=> setForm(v=> ({ ...v, [f.name]: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      ))}
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      <button disabled={loading} className="w-full px-4 py-3 rounded-xl bg-primary text-white">{loading ? 'Please wait...' : cta}</button>
    </form>
  )
}