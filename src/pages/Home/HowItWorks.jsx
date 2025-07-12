import { Search, FileText, Send, BadgeCheck } from 'lucide-react';

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
    <section className="py-20 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-500 mb-4">How It Works</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          ScholarSys offers a smooth and transparent scholarship journey in four easy steps.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 text-center flex flex-col items-center"
            >
              <Icon size={36} className="text-blue-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2">{title}</h4>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;