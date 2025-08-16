import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Users, School, Globe, Star } from "lucide-react";

const ReviewStats = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const [stats, setStats] = useState({
    students: 1200,
    scholarships: 120,
    countries: 110,
    rating: 4.8,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      icon: Users,
      value: stats.students,
      label: "Students Supported",
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      icon: School,
      value: stats.scholarships,
      label: "Scholarships Published",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      icon: Globe,
      value: stats.countries,
      label: "Countries Reached",
      color: "text-sky-600",
      bg: "bg-sky-100",
    },
    {
      icon: Star,
      value: stats.rating,
      label: "Average Rating",
      color: "text-amber-500",
      bg: "bg-amber-100",
      isRating: true,
    },
  ];

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
        >
          Our Trusted Impact
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg"
        >
          ScholarSys empowers thousands of learners worldwide. These numbers
          reflect the scale of our mission.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center border border-gray-100"
            >
              {/* Icon */}
              <div className={`p-4 rounded-full ${card.bg} mb-5 shadow-inner`}>
                <card.icon size={40} className={card.color} />
              </div>

              {/* Number */}
              <h3 className="text-4xl font-bold text-gray-900 flex items-center">
                <CountUp
                  start={0}
                  end={card.value}
                  duration={2}
                  decimals={card.isRating ? 1 : 0}
                  suffix={card.isRating ? "" : "+"}
                />
                {card.isRating && (
                  <span className="ml-1 text-amber-500 text-2xl">★</span>
                )}
              </h3>

              {/* Label */}
              <p className="mt-3 text-base font-medium text-gray-600">
                {card.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewStats;
