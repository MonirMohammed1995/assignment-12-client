import React from 'react';
import { Search, FileText, Send, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Search,
    title: "Step 1: Browse",
    desc: "Filter scholarships by country, degree, or criteria and shortlist instantly.",
  },
  {
    icon: FileText,
    title: "Step 2: Apply",
    desc: "Complete a clean application process directly through our system.",
  },
  {
    icon: Send,
    title: "Step 3: Submit",
    desc: "Submit your documents securely and track progress in real-time.",
  },
  {
    icon: BadgeCheck,
    title: "Step 4: Awarded",
    desc: "Receive offer letters and start your dream academic journey.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            ScholarSys offers a smooth and transparent scholarship journey in four easy steps.
          </motion.p>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 flex flex-col items-center text-center"
            >
              <div className="p-4 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 mb-4">
                <Icon size={36} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">{title}</h4>
              <p className="text-sm text-gray-500">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
