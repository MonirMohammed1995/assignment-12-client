import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const api = import.meta.env.VITE_API_URL;

  // Fetch all reviews
  useEffect(() => {
    fetch(`${api}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('❌ Failed to fetch reviews:', err));
  }, [api]);

  // Delete review handler
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This review will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${api}/reviews/${id}`, {
          method: 'DELETE',
        })
          .then(res => res.json())
          .then(() => {
            Swal.fire('Deleted!', 'Review has been deleted.', 'success');
            setReviews(prev => prev.filter(review => review._id !== id));
          });
      }
    });
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Reviews (Admin)</h2>

      <div className="overflow-x-auto shadow border rounded-lg">
        <table className="table w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Reviewer</th>
              <th className="p-3 text-left">Scholarship</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Comment</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review._id} className="border-t">
                  <td className="p-3">{review.reviewerName || 'Anonymous'}</td>
                  <td className="p-3">{review.scholarshipName || 'N/A'}</td>
                  <td className="p-3">{review.rating || 'N/A'}⭐</td>
                  <td className="p-3">{review.comment || 'No comment'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan="5">
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
