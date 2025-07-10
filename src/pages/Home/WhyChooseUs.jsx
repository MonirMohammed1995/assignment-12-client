import { Lightbulb, ShieldCheck, Clock, Globe2 } from 'lucide-react';

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
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">Why Choose ScholarSys?</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          We simplify the scholarship process with cutting-edge tools, expert curation, and a student-first approach.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 text-center flex flex-col items-center"
            >
              <Icon size={36} className="text-primary mb-4" />
              <h4 className="text-lg font-semibold mb-2">{title}</h4>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;