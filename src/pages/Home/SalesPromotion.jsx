import React from "react";
import { Tag, ArrowRight } from "lucide-react";

const promotions = [
  {
    id: 1,
    title: "50% Application Fee Waiver",
    description: "Apply early and get a 50% discount on your scholarship application fee.",
    validTill: "31st August 2025",
  },
  {
    id: 2,
    title: "Early Bird Scholarship Bonus",
    description: "Get extra priority in the selection process by applying before the deadline.",
    validTill: "15th September 2025",
  },
  {
    id: 3,
    title: "Referral Rewards",
    description: "Invite friends and earn credits for your next application.",
    validTill: "Ongoing",
  },
];

const SalesPromotion = () => {
  return (
    <section className="py-12 px-6 md:px-12 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          🎉 Current Promotions
        </h2>
        <p className="text-gray-600 text-center mb-10">
          Take advantage of our latest offers and make your scholarship journey more affordable.
        </p>

        {/* Promotions List */}
        <ul className="space-y-6">
          {promotions.map((promo) => (
            <li
              key={promo.id}
              className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <Tag size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {promo.title}
                </h3>
                <p className="text-gray-600 mt-1">{promo.description}</p>
                <p className="text-sm text-indigo-600 font-medium mt-2">
                  Valid Till: {promo.validTill}
                </p>
              </div>
              <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
                Claim <ArrowRight size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SalesPromotion;
