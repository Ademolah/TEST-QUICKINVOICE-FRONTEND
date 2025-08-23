// import React from "react";

// const features = [
//   {
//     title: "Easy Invoicing",
//     description: "Create and send professional invoices in seconds.",
//     icon: "📄",
//   },
//   {
//     title: "Payment Tracking",
//     description: "Monitor payments and get instant alerts for overdue invoices.",
//     icon: "💳",
//   },
//   {
//     title: "Custom Branding",
//     description: "Add your logo and customize invoice templates.",
//     icon: "🎨",
//   },
//   {
//     title: "Analytics Dashboard",
//     description: "Track revenue, unpaid invoices, and trends.",
//     icon: "📊",
//   },
//   {
//     title: "Multi-Currency Support",
//     description: "Invoice clients in their local currency.",
//     icon: "🌍",
//   },
//   {
//     title: "Team Collaboration",
//     description: "Add multiple team members with role-based permissions.",
//     icon: "👥",
//   },
// ];

// export default function Features() {
//   return (
//     <section className="py-20 bg-white" id="features">
//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Powerful Features</h2>
//           <p className="mt-4 text-lg text-gray-600">Everything you need to manage invoices like a pro.</p>
//         </div>

//         <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
//           {features.map((feature) => (
//             <div key={feature.title} className="flex flex-col items-start">
//               <div className="text-4xl mb-4">{feature.icon}</div>
//               <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
//               <p className="mt-2 text-gray-600">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Easy Invoicing",
    description: "Create and send professional invoices in seconds.",
    icon: "📄",
  },
  {
    title: "Payment Tracking",
    description: "Monitor payments and get instant alerts for overdue invoices.",
    icon: "💳",
  },
  {
    title: "Custom Branding",
    description: "Add your logo and customize invoice templates.",
    icon: "🎨",
  },
  {
    title: "Analytics Dashboard",
    description: "Track revenue, unpaid invoices, and trends.",
    icon: "📊",
  },
  {
    title: "Multi-Currency Support",
    description: "Invoice clients in their local currency.",
    icon: "🌍",
  },
  {
    title: "Team Collaboration",
    description: "Add multiple team members with role-based permissions.",
    icon: "👥",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-gray-100" id="features">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-gray-600"
          >
            Everything you need to manage Business like a pro.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
