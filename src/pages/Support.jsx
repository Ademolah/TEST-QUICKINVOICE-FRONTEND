import React from "react";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const Support = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    from_name: '',
    from_email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.from_name.trim()) newErrors.from_name = 'Name is required';
    if (!form.from_email.trim()) {
      newErrors.from_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.from_email)) {
      newErrors.from_email = 'Email is invalid';
    }
   
    if (!form.message.trim()) newErrors.message = 'Message is required';

    return newErrors;
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    toast.promise(
      emailjs.send(
        'service_5xchz5i',
        'template_gehipuf',
        form,
        '5rER37I1dsORgSj8n'
      ),
      {
        loading: 'Sending...',
        success: 'Message sent successfully!',
        error: 'Failed to send message. Try again later.',
      }
    ).then(() => {
      setForm({
        from_name: '',
        from_email: '',
        message: '',
      });
    });
  };

  const supportOptions = [
    {
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      title: "Email Support",
      description: "Get in touch with our team via email for assistance.",
      action: () => window.location.href = "mailto:info@hqbinary.com",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-500" />,
      title: "Live Chat",
      description: "Chat with our support agents in real-time.",
      action: () => alert("Live chat coming soon!"),
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-yellow-500" />,
      title: "FAQ",
      description: "Browse our frequently asked questions.",
      action: () => navigate("/faq"),
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Support Center</h1>
        <p className="text-gray-600">
          Need help? Our team is here to assist you every step of the way.
        </p>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        {supportOptions.map((opt, idx) => (
          <div
            key={idx}
            onClick={opt.action}
            className="bg-white shadow-lg rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex justify-center mb-4">{opt.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{opt.title}</h2>
            <p className="text-gray-500 text-sm">{opt.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Send us a message</h2>
        <form onSubmit={sendEmail} className="space-y-4">
          <input
            type="text"
            name="from_name"
            value={form.from_name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.from_name && <p className="text-red-500 text-sm mt-1">{errors.from_name}</p>}
          <input
            type="email"
            name="from_email"
            value={form.from_email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.from_email && <p className="text-red-500 text-sm mt-1">{errors.from_email}</p>}
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300"
          >
            Submit Request
          </button>
        </form>
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
};

export default Support;
