import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthProvider';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`${api}/applications?email=${user.email}`)
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(() => Swal.fire('Error', 'Failed to load applications', 'error'))
      .finally(() => setLoading(false));
  }, [user, api]);

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to cancel this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${api}/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' }),
      });
      if (!res.ok) throw new Error('Failed to cancel');
      setApplications(apps =>
        apps.map(app => (app._id === id ? { ...app, status: 'Rejected' } : app))
      );
      Swal.fire('Canceled!', 'Application has been canceled.', 'success');
    } catch {
      Swal.fire('Error', 'Failed to cancel application.', 'error');
    }
  };

  const handleEdit = (status) => {
    if (status !== 'pending') {
      return Swal.fire('Not Allowed', 'Cannot edit once application is processing/completed.', 'warning');
    }
    // TODO: Add navigation to edit page here
  };

  const openReviewModal = (app) => {
    setSelectedApp(app);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const review = {
      scholarshipId: selectedApp.scholarshipId,
      universityId: selectedApp.universityId,
      scholarshipName: selectedApp.scholarshipName,
      universityName: selectedApp.universityName,
      reviewerName: user?.displayName || 'Anonymous',
      reviewerEmail: user?.email,
      reviewerImage: user?.photoURL || '',
      rating: parseInt(form.rating.value, 10),
      comment: form.comment.value.trim(),
      date: format(new Date(), 'PPP'),
    };

    try {
      const res = await fetch(`${api}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (!res.ok) throw new Error('Submit failed');
      Swal.fire('Success', 'Review submitted!', 'success');
      setReviewModalOpen(false);
    } catch {
      Swal.fire('Error', 'Failed to submit review.', 'error');
    }
  };

  if (loading) return <div className="text-center py-6 text-gray-600">Loading applications...</div>;

  if (applications.length === 0)
    return <div className="text-center py-6 text-gray-600">No applications found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">🎓 My Applications</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {[
                'University',
                'Feedback',
                'Subject',
                'Degree',
                'Fee',
                'Service',
                'Status',
                'Actions',
              ].map((head) => (
                <th key={head} className="border border-gray-300 px-4 py-2 text-left">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app._id}
                className="hover:bg-gray-50 border border-gray-300"
                aria-label={`Application to ${app.universityName}`}
              >
                <td className="px-4 py-3 whitespace-nowrap max-w-xs">
                  <p className="font-medium text-gray-900">{app.universityName}</p>
                  <p className="text-sm text-gray-500">{app.universityAddress}</p>
                </td>
                <td className="px-4 py-3">{app.feedback || 'N/A'}</td>
                <td className="px-4 py-3">{app.subjectCategory}</td>
                <td className="px-4 py-3">{app.appliedDegree}</td>
                <td className="px-4 py-3">{app.applicationFees}৳</td>
                <td className="px-4 py-3">{app.serviceCharge}৳</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                    aria-label={`Status: ${app.status}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <Link
                    to={`/scholarships/${app.scholarshipId}`}
                    className="btn btn-sm btn-info"
                    aria-label={`View details of ${app.scholarshipName}`}
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => handleEdit(app.status)}
                    className="btn btn-sm btn-warning"
                    aria-label={`Edit application with status ${app.status}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCancel(app._id)}
                    className="btn btn-sm btn-error"
                    aria-label="Cancel application"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => openReviewModal(app)}
                    className="btn btn-sm btn-success"
                    aria-label="Submit a review"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedApp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4"
          >
            <h3 id="review-modal-title" className="text-xl font-semibold text-gray-900">
              Submit Review for {selectedApp.scholarshipName}
            </h3>
            <label htmlFor="rating" className="block font-medium text-gray-700">
              Rating (1-5)
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              min={1}
              max={5}
              required
              className="input input-bordered w-full"
            />
            <label htmlFor="comment" className="block font-medium text-gray-700">
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              required
              className="textarea textarea-bordered w-full resize-none"
              placeholder="Write your comment here..."
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
