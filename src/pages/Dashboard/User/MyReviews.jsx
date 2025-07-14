import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthProvider';

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`https://your-api-url.com/reviews?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setReviews(data);
          setLoading(false);
        });
    }
  }, [user]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this review?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://your-api-url.com/reviews/${id}`, {
          method: 'DELETE',
        })
          .then(res => res.json())
          .then(() => {
            Swal.fire('Deleted!', 'Your review has been deleted.', 'success');
            setReviews(reviews.filter(review => review._id !== id));
          });
      }
    });
  };

  const handleEdit = (review) => {
    setEditingReview(review);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedReview = {
      ...editingReview,
      comment: form.comment.value,
      date: form.date.value,
    };
    const api = import.meta.env.VITE_API_URL
    fetch(`${api}reviews/${editingReview._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedReview),
    })
      .then(res => res.json())
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your review has been successfully updated.',
        });
        setReviews(reviews.map(r => r._id === editingReview._id ? updatedReview : r));
        setEditingReview(null);
      });
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading reviews...</div>;

  return (
    <div className="p-6 bg-white shadow rounded-xl overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">My Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-600">You haven't submitted any reviews yet.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700">
              <th className="p-3 border">Scholarship</th>
              <th className="p-3 border">University</th>
              <th className="p-3 border">Comment</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review._id} className="hover:bg-indigo-50 transition">
                <td className="p-3 border">{review.scholarshipName}</td>
                <td className="p-3 border">{review.universityName}</td>
                <td className="p-3 border">{review.comment}</td>
                <td className="p-3 border">{review.date}</td>
                <td className="p-3 border text-center space-x-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Edit Review</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Review Comment</label>
                <textarea
                  name="comment"
                  defaultValue={editingReview.comment}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Review Date</label>
                <input
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