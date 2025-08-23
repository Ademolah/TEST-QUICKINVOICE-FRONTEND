import { motion } from "framer-motion";
import { ShieldCheck, CreditCard } from "lucide-react";

export default function ExtraSections() {
  return (
    <div className="w-full flex flex-col gap-24">
      {/* Billing Section */}
      <section className="relative bg-gradient-to-r from-[#0046A5] to-[#00B86B] py-20 px-6 text-white rounded-2xl shadow-xl">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
          >
            Simple, Transparent Billing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg max-w-2xl mx-auto mb-10"
          >
            Pay only for what you need. No hidden fees. Upgrade your plan as your business grows — from free invoicing to enterprise-ready features.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <div className="bg-white text-gray-800 rounded-xl p-8 shadow-lg w-72">
              <CreditCard className="w-10 h-10 text-[#0046A5] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="mb-4 text-sm">15 invoices & receipts /month. Perfect for freelancers.</p>
              <p className="text-2xl font-bold">₦0</p>
            </div>
            <div className="bg-white text-gray-800 rounded-xl p-8 shadow-lg w-72">
              <CreditCard className="w-10 h-10 text-[#00B86B] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="mb-4 text-sm">Unlimited invoices & receipts, payment tracking.</p>
              <p className="text-2xl font-bold">₦3,000/mo</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="relative py-20 px-6 bg-[#F9FAFB] rounded-2xl shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-6"
          >
            Security You Can Trust
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Your business data is protected with bank-level encryption, secure payments, and always-on reliability.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-10"
          >
            <div className="flex flex-col items-center w-60">
              <ShieldCheck className="w-12 h-12 text-[#0046A5] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Bank-Grade Security</h3>
              <p className="text-sm text-gray-600">All transactions encrypted with AES-256 & SSL.</p>
            </div>
            <div className="flex flex-col items-center w-60">
              <ShieldCheck className="w-12 h-12 text-[#00B86B] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trusted Infrastructure</h3>
              <p className="text-sm text-gray-600">Powered by top-tier cloud providers for uptime & speed.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
