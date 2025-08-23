import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-[#0046A5] via-[#00B86B] to-[#0046A5] bg-[length:200%_200%]"></div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Power Your Business with{" "}
          <span className="text-[#00B86B]">QuickInvoice NG</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          Send invoices, track payments, and grow your business with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to='/register'>
            <button className="px-6 py-3 rounded-full bg-[#00B86B] hover:bg-[#00995a] transition font-semibold">
            Get Started
            </button>
          </Link>
          <button className="px-6 py-3 rounded-full border border-white hover:bg-white hover:text-[#0046A5] transition font-semibold">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
