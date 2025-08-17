import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Trash2 } from 'lucide-react';

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${api}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, [api]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc2626',
    });

    if (confirm.isConfirmed) {
      fetch(`${api}/reviews/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          if (data.deletedCount > 0) {
            Swal.fire('Deleted!', 'The review has been deleted.', 'success');
            setReviews(prev => prev.filter(review => review._id !== id));
          }
        });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">All Reviews</h2>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">University</th>
              <th className="px-4 py-3 text-left">Reviewer</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Comments</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <tr key={review._id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-2 font-medium">{review.universityName}</td>
                  <td className="px-4 py-2 flex items-center gap-3">
                    <img
                      src={review.reviewerImage || 'https://via.placeholder.com/40'}
                      alt={review.reviewerName}
                      className="w-8 h-8 rounded-full border"
                    />
                    <div>
                      <p className="font-medium">{review.reviewerName}</p>
                      <p className="text-xs text-gray-500">{review.reviewDate}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      {review.rating} ★
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-700">{review.comment}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="flex items-center justify-center gap-2 text-red-600 hover:text-red-800 transition px-3 py-1 rounded-md border border-red-200 hover:bg-red-50"
                      title="Delete Review"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
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

export default AllReviews;
