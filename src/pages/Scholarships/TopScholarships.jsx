import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FaStar } from "react-icons/fa";

// Skeleton loader for cards
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 rounded-2xl h-96 w-full" />
);

// Star rating component
const StarRating = ({ rating }) => {
  const filled = Math.round(rating) || 0;
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={i < filled ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
};

const TopScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/scholarships`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => {
          const feeA = parseFloat(a.applicationFees) || 0;
          const feeB = parseFloat(b.applicationFees) || 0;
          const dateA = new Date(a.postDate).getTime() || 0;
          const dateB = new Date(b.postDate).getTime() || 0;
          return feeA === feeB ? dateB - dateA : feeA - feeB;
        });
        setScholarships(sorted);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading scholarships:", err));
  }, []);

  const visibleScholarships = scholarships.slice(0, visibleCount);
  const handleViewMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-600 mb-12">
        🎓 Top Scholarships
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          : visibleScholarships.map((item) => {
              const deadline = new Date(item.deadline);
              const deadlineText = !isNaN(deadline.getTime())
                ? formatDistanceToNow(deadline, { addSuffix: true })
                : "N/A";

              const averageRating =
                item.totalRating && item.ratingCount
                  ? (item.totalRating / item.ratingCount).toFixed(1)
                  : 0;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden transition-transform transform hover:-translate-y-2 hover:scale-[1.02]"
                >
                  <figure className="h-48 flex items-center justify-center bg-gray-50 p-4">
                    <img
                      src={item.universityImage || "/fallback-university.jpg"}
                      alt={item.universityName}
                      className="h-full object-contain rounded-xl"
                      loading="lazy"
                    />
                  </figure>

                  <div className="p-6 flex flex-col justify-between h-[280px]">
                    <div className="space-y-2 text-sm">
                      <h3 className="font-semibold text-gray-900 text-lg truncate">
                        {item.universityName}
                      </h3>
                      <p className="text-gray-500 truncate">
                         {item.universityCity || "Unknown"}, {item.universityCountry || "Unknown"}
                      </p>
                      <p className="text-gray-500 truncate">
                         {item.subjectCategory || "N/A"}
                      </p>
                      <p className="text-gray-500">
                         Tuition: {item.tuitionFees || "Free"}
                      </p>
                      <p className="text-gray-500">
                         App Fee: {item.applicationFees || "Free"}
                      </p>
                      <p className="text-gray-500">
                         Deadline: {deadlineText}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium text-gray-600">⭐ {averageRating}</span>
                        <StarRating rating={averageRating} />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link to={`/scholarships/${item._id}`}>
                        <button className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold hover:scale-105 hover:shadow-xl transition transform shadow-md">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="flex flex-col items-center mt-16 space-y-4">
        {visibleCount < scholarships.length ? (
          <button
            onClick={handleViewMore}
            className="px-8 py-3 rounded-2xl border-2 border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition"
          >
            View More
          </button>
        ) : (
          <span className="text-gray-500 text-sm">No more scholarships</span>
        )}

        <Link to="/all-scholarships">
          <button className="px-10 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg">
            See All Scholarships
          </button>
        </Link>
      </div>
    </section>
  );
};

export default TopScholarships;
