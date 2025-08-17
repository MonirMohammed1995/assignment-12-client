import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Star, ArrowRight, Loader2 } from "lucide-react";

const FeaturedProducts = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  // ✅ Fetch scholarships from server
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scholarships/featured`); // 👉 তোর API route
        const data = await res.json();
        setScholarships(data);
      } catch (error) {
        console.error("Failed to load scholarships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // ✅ Apply Now Handler
  const handleApply = async (id) => {
    try {
      setApplyingId(id);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scholarships/apply/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body তে user info পাঠানো লাগতে পারে
        body: JSON.stringify({ userId: "12345" }),
      });

      const result = await res.json();
      alert(result.message || "Application submitted successfully!");
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to apply. Please try again.");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          🎓 Featured Scholarships
        </motion.h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore exclusive scholarships carefully selected to empower students globally.
        </p>

        {/* Loading */}
        {loading && <p className="text-gray-500">Loading scholarships...</p>}

        {/* Scholarship Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholarships.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition relative group"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm shadow">
                  {item.amount}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  {item.provider}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Deadline: <span className="font-medium">{item.deadline}</span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={applyingId === item._id}
                  onClick={() => handleApply(item._id)}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-xl shadow hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-70"
                >
                  {applyingId === item._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Applying...
                    </>
                  ) : (
                    <>
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
