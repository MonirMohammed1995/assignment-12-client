import { Lightbulb, ShieldCheck, Clock, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Lightbulb,
    title: "Smart Search",
    desc: "Our intelligent algorithm matches you with scholarships that fit your goals.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Your data is encrypted and your profile is protected at every step.",
  },
  {
    icon: Clock,
    title: "Real-Time Alerts",
    desc: "Get notified about deadlines and results before anyone else.",
  },
  {
    icon: Globe2,
    title: "Global Access",
    desc: "Explore scholarship options from 50+ countries and top universities.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
        >
          Why Choose <span className="text-blue-600">ScholarSys?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-600 max-w-2xl mx-auto mb-16"
        >
          We simplify the scholarship process with cutting-edge tools, expert curation, and a student-first approach.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center
                         hover:shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <div className="p-5 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 mb-5">
                <Icon size={40} className="text-blue-600" />
              </div>
              <h4 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">{title}</h4>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
