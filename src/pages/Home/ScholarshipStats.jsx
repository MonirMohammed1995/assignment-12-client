import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  GraduationCap,
  Globe2,
  Award,
  Star
} from "lucide-react";

const ScholarshipStats = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const stats = [
    {
      id: 1,
      label: "Total Students",
      value: 12500,
      icon: <GraduationCap size={40} className="text-indigo-600" />,
      suffix: "+"
    },
    {
      id: 2,
      label: "Countries",
      value: 42,
      icon: <Globe2 size={40} className="text-green-600" />,
      suffix: "+"
    },
    {
      id: 3,
      label: "Scholarships",
      value: 380,
      icon: <Award size={40} className="text-yellow-500" />,
      suffix: "+"
    },
    {
      id: 4,
      label: "Average Rating",
      value: 4.8,
      icon: <Star size={40} className="text-orange-500" />,
      suffix: "/5"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Scholarship Impact & Reach
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Numbers that reflect our global presence and excellence
          </p>
        </div>

        {/* Stats Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-8"
            >
              {/* Icon */}
              <div className="mb-4">{stat.icon}</div>

              {/* Number Counter */}
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                {inView && (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                    decimals={stat.id === 4 ? 1 : 0}
                  />
                )}
              </h3>

              {/* Label */}
              <p className="text-gray-600 mt-2 text-lg font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScholarshipStats;
