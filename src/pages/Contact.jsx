import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

export default function Contact() {
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
    
  return (
    
    <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar/>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold font-poppins"
        >
          Get in Touch with QuickInvoice NG
        </motion.h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto font-inter">
          We’d love to hear from you. Whether you’re a customer, partner, or
          business looking to scale, let’s connect!
        </p>
      </section>

      {/* Contact Content */}
      <section className="flex flex-col md:flex-row justify-center items-start gap-10 py-16 px-6 md:px-20">
        {/* Left: Contact Info */}
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold font-poppins text-[#0046A5] mb-4">
            Contact Information
          </h2>
          <p className="text-gray-600 mb-6">
            Reach out to us directly through the following:
          </p>
          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold">📍 Address:</span> Abuja, Nigeria
            </p>
            <p>
              <span className="font-semibold">📧 Email:</span>{" "}
              support@quickinvoiceng.com
            </p>
            <p>
              <span className="font-semibold">📞 Phone:</span> +234 800 000 0000
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold font-poppins text-[#0046A5] mb-4">
            Send Us a Message
          </h2>
          <form onSubmit={sendEmail} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="from_name"
                value={form.from_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
              />
              {errors.from_name && <p className="text-red-500 text-sm mt-1">{errors.from_name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="from_email"
                value={form.from_email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
              />
              {errors.from_email && <p className="text-red-500 text-sm mt-1">{errors.from_email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                placeholder="Write your message..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-[#0046A5] to-[#00B86B] text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition w-full md:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
      <Footer/>
    </div>
  );
}