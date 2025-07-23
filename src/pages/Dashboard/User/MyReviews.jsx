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
      .then(data => setReviews(data))
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
          .then(res => res.json())
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
      .then(res => res.json())
      .then(() => {
        Swal.fire('Updated!', 'Your review has been updated successfully.', 'success');
        setReviews(prev =>
          prev.map(r => (r._id === editingReview._id ? updatedReview : r))
        );
        setEditingReview(null);
      })
      .catch(() => Swal.fire('Error', 'Failed to update review.', 'error'));
  };

  if (loading) {
    return <div className="text-center py-10 text-lg text-gray-600">Loading reviews...</div>;
  }

  return (
    <div className="p-6 bg-white shadow rounded-xl overflow-x-auto max-w-7xl mx-auto mb-16">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't submitted any reviews yet.</p>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="p-3 border border-indigo-200 text-left">Scholarship</th>
              <th className="p-3 border border-indigo-200 text-left">University</th>
              <th className="p-3 border border-indigo-200 text-left">Comment</th>
              <th className="p-3 border border-indigo-200 text-left">Date</th>
              <th className="p-3 border border-indigo-200 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="hover:bg-indigo-50 transition">
                <td className="p-3 border border-indigo-200">{review.scholarshipName}</td>
                <td className="p-3 border border-indigo-200">{review.universityName}</td>
                <td className="p-3 border border-indigo-200 break-words">{review.comment}</td>
                <td className="p-3 border border-indigo-200">{review.date}</td>
                <td className="p-3 border border-indigo-200 text-center space-x-2">
                  <button
                    onClick={() => setEditingReview(review)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingReview(null);
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              Edit Review for <span className="text-indigo-600">{editingReview.scholarshipName}</span>
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Review Date
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  defaultValue={editingReview.date || new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
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
