import React, { useState } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Star, Users, School, Globe } from 'lucide-react';

const stats = [
  {
    icon: Users,
    count: 5000,
    label: 'Students Supported',
  },
  {
    icon: School,
    count: 1200,
    label: 'Scholarships Published',
  },
  {
    icon: Globe,
    count: 50,
    label: 'Countries Reached',
  },
  {
    icon: Star,
    count: 4.8,
    label: 'Average Rating',
    isRating: true,
  },
];

const ReviewStats = () => {
  const { ref, inView } = useInView({
    triggerOnce: false, // 👈 ensures re-trigger on scroll
    threshold: 0.3,
  });

  const [key, setKey] = useState(0); // Helps re-render CountUp when inView toggles

  React.useEffect(() => {
    if (inView) {
      setKey(prev => prev + 1); // Trigger rerender
    }
  }, [inView]);

  return (
    <section className="bg-base-100 py-20 border-t" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-500 mb-4">Our Trusted Impact</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          ScholarSys continues to empower thousands of learners worldwide — here’s how we’ve made a difference.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, count, label, isRating }, index) => (
            <div
              key={`${index}-${key}`} // 👈 re-renders on key change to replay animation
              className="flex flex-col items-center justify-center px-4 py-6 bg-white shadow-md rounded-xl transition hover:shadow-lg"
            >
              <div className="mb-3">
                <Icon size={36} className={`${isRating ? 'text-yellow-400' : 'text-blue-500'}`} />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">
                <CountUp
                  start={0}
                  end={count}
                  duration={2}
                  decimals={isRating ? 1 : 0}
                  suffix={isRating ? '' : '+'}
                />
                {isRating && <span className="text-yellow-400 text-2xl ml-1">★</span>}
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewStats;
