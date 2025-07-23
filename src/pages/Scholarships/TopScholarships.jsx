import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const TopScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const api = import.meta.env.VITE_API_URL;

    fetch(`${api}/scholarships`)
      .then((res) => res.json())
      .then((data) => {
        // Sort: lowest application fee → newest post
        const sorted = data.sort((a, b) => {
          const feeA = parseFloat(a.applicationFees) || 0;
          const feeB = parseFloat(b.applicationFees) || 0;
          const dateA = new Date(a.postDate).getTime() || 0;
          const dateB = new Date(b.postDate).getTime() || 0;

          return feeA === feeB ? dateB - dateA : feeA - feeB;
        });

        setScholarships(sorted);
      })
      .catch((err) => console.error("Error loading scholarships:", err));
  }, []);

  // Show scholarships according to visibleCount
  const visibleScholarships = scholarships.slice(0, visibleCount);

  // Handler for "View More"
  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-primary mb-10">
        🎓 Top Scholarships
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleScholarships.map((item) => {
          const deadline = new Date(item.deadline);
          const deadlineText = !isNaN(deadline.getTime())
            ? formatDistanceToNow(deadline, { addSuffix: true })
            : "N/A";

          const averageRating =
            item.totalRating && item.ratingCount
              ? (item.totalRating / item.ratingCount).toFixed(1)
              : "No Rating";

          return (
            <div
              key={item._id}
              className="card shadow-md hover:shadow-xl transition duration-300 bg-base-100 border border-base-200"
            >
              <figure className="px-6 pt-6">
                <img
                  src={item.universityImage}
                  alt={item.universityName}
                  className="rounded-xl h-40 object-contain"
                  loading="lazy"
                />
              </figure>
              <div className="card-body space-y-2 text-sm">
                <h3 className="card-title text-lg text-neutral">
                  {item.universityName}
                </h3>
                <p>
                  <span className="font-medium">📍 Location:</span>{" "}
                  {item.universityCity || "Unknown"},{" "}
                  {item.universityCountry || "Unknown"}
                </p>
                <p>
                  <span className="font-medium">📚 Subject:</span>{" "}
                  {item.subjectCategory || "N/A"}
                </p>
                <p>
                  <span className="font-medium">💰 Tuition Fee:</span>{" "}
                  {item.tuitionFees || "Free"}
                </p>
                <p>
                  <span className="font-medium">💰 Application Fee:</span>{" "}
                  {item.applicationFees || "Free"}
                </p>
                <p>
                  <span className="font-medium">⏳ Deadline:</span>{" "}
                  {deadlineText}
                </p>
                <p>
                  <span className="font-medium">⭐ Rating:</span>{" "}
                  {averageRating}
                </p>
                <div className="card-actions justify-end mt-3">
                  <Link to={`/scholarship-details/${item._id}`}>
                    <button className="btn btn-sm btn-outline btn-primary hover:btn-primary">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center mt-10 space-y-4">
        {visibleCount < scholarships.length ? (
          <button
            onClick={handleViewMore}
            className="btn btn-outline btn-primary"
          >
            View More
          </button>
        ) : (
          <span className="text-sm text-gray-500">No more scholarships</span>
        )}

        <Link to="/all-scholarships">
          <button className="btn btn-primary btn-wide">
            See All Scholarships
          </button>
        </Link>
      </div>
    </section>
  );
};

export default TopScholarships;