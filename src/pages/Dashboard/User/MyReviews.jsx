import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthProvider';

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`${api}/reviews?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
      })
      .catch(() => Swal.fire('Error', 'Failed to load reviews', 'error'))
      .finally(() => setLoading(false));
  }, [user, api]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this review?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${api}/reviews/${id}`, { method: 'DELETE' })
          .then(res => {
            if (!res.ok) throw new Error('Delete failed');
            return res.json();
          })
          .then(() => {
            Swal.fire('Deleted!', 'Your review has been deleted.', 'success');
            setReviews(prev => prev.filter(review => review._id !== id));
          })
          .catch(() => Swal.fire('Error', 'Failed to delete review.', 'error'));
      }
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedReview = {
      ...editingReview,
      comment: form.comment.value.trim(),
      date: form.date.value,
    };

    fetch(`${api}/reviews/${editingReview._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedReview),
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your review has been updated successfully.',
        });
        setReviews(prev =>
          prev.map(r => (r._id === editingReview._id ? updatedReview : r))
        );
        setEditingReview(null);
      })
      .catch(() => Swal.fire('Error', 'Failed to update review.', 'error'));
  };

  if (loading) return <div className="text-center py-10 text-lg text-gray-600">Loading reviews...</div>;

  return (
    <div className="p-6 bg-white shadow rounded-xl overflow-x-auto max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't submitted any reviews yet.</p>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              {['Scholarship', 'University', 'Comment', 'Date', 'Actions'].map((header) => (
                <th key={header} className="p-3 border border-indigo-200 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="hover:bg-indigo-50 transition">
                <td className="p-3 border border-indigo-200 max-w-xs truncate" title={review.scholarshipName}>
                  {review.scholarshipName}
                </td>
                <td className="p-3 border border-indigo-200 max-w-xs truncate" title={review.universityName}>
                  {review.universityName}
                </td>
                <td className="p-3 border border-indigo-200 max-w-md break-words">{review.comment}</td>
                <td className="p-3 border border-indigo-200">{review.date}</td>
                <td className="p-3 border border-indigo-200 text-center space-x-2">
                  <button
                    onClick={() => setEditingReview(review)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    aria-label={`Edit review for ${review.scholarshipName}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label={`Delete review for ${review.scholarshipName}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editingReview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-review-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingReview(null);
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 id="edit-review-title" className="text-xl font-bold mb-4 text-gray-900">
              Edit Review for <span className="italic">{editingReview.scholarshipName}</span>
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="comment" className="block mb-1 font-medium text-gray-700">
                  Review Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  defaultValue={editingReview.comment}
                  className="w-full border border-gray-300 p-2 rounded-lg resize-y"
                  required
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="date" className="block mb-1 font-medium text-gray-700">
                  Review Date
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  defaultValue={editingReview.date}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
