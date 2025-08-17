import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const api = import.meta.env.VITE_API_URL;

  // Fetch all reviews
  useEffect(() => {
    fetch(`${api}/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("❌ Failed to fetch reviews:", err));
  }, [api]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${api}/reviews/${id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then(() => {
            Swal.fire("Deleted!", "Review has been deleted.", "success");
            setReviews((prev) => prev.filter((review) => review._id !== id));
          });
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
        Manage Reviews (Admin)
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-3">Reviewer</th>
              <th className="px-4 py-3">Scholarship</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3">{review.reviewerName || "Anonymous"}</td>
                  <td className="px-4 py-3">{review.scholarshipName || "N/A"}</td>
                  <td className="px-4 py-3">{review.rating || "N/A"}⭐</td>
                  <td className="px-4 py-3">{review.comment || "No comment"}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete review"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageReviews;
