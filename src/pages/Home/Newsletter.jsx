import React from "react";
import { motion } from "framer-motion";
import { Mail, Bell, BookOpen } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="relative py-16 px-6 md:px-20 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 rounded-full bg-blue-100 shadow-md">
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Stay Updated with Scholarship Opportunities
        </motion.h2>

        {/* Subheading */}
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Subscribe to get the latest <span className="text-blue-600 font-medium">scholarship deadlines</span>, 
          <span className="text-blue-600 font-medium"> success stories</span>, and <span className="text-blue-600 font-medium">exclusive tips</span> 
          directly in your inbox.
        </p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full md:w-96 px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-2xl shadow-md"
          >
            Subscribe
          </button>
        </motion.form>

        {/* Bottom Info */}
        <div className="mt-8 flex items-center justify-center gap-3 text-gray-500 text-sm">
          <Mail className="w-5 h-5" />
          <span>No spam. Only scholarship updates.</span>
        </div>

        {/* Extra: Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14"
        >
          <div className="p-6 rounded-2xl bg-white shadow hover:shadow-lg transition">
            <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Deadline Alerts</h4>
            <p className="text-gray-500 text-sm">Never miss any scholarship application deadline.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow hover:shadow-lg transition">
            <Bell className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Exclusive Updates</h4>
            <p className="text-gray-500 text-sm">Get insider scholarship tips and news.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow hover:shadow-lg transition">
            <Mail className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Success Stories</h4>
            <p className="text-gray-500 text-sm">Learn from past winners and their journeys.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
