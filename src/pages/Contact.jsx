import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaWhatsapp, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Get in Touch
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          We'd love to hear from you! Whether you have a question, feedback, or
          just want to say hello, reach out via email, WhatsApp, or the form
          below.
        </motion.p>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.a
            href="mailto:monirmdnayemsaju42@email.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition transform duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <FaEnvelope className="text-blue-500 text-4xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">Email</h3>
            <p className="text-gray-600 text-sm">monirmdnayemsaju42@email.com</p>
          </motion.a>

          <motion.a
            href="https://wa.me/8801794231642"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition transform duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <FaWhatsapp className="text-green-500 text-4xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">WhatsApp</h3>
            <p className="text-gray-600 text-sm">+8801794231642</p>
          </motion.a>

          <motion.a
            href="#contact-form"
            className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition transform duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <FaPaperPlane className="text-purple-500 text-4xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">Message</h3>
            <p className="text-gray-600 text-sm">Send us a quick message</p>
          </motion.a>
        </div>

        {/* Contact Form */}
        <motion.form
          id="contact-form"
          className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              placeholder="Write your message..."
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-600 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
