import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthProvider';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const { user, loading } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      fetch(`${import.meta.env.VITE_API_URL}/applications?email=${user.email}`)
        .then(res => res.json())
        .then(data => setApplications(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This application will be cancelled!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected' }),
        });
        const data = await res.json();
        if (data.modifiedCount > 0) {
          Swal.fire('Cancelled!', 'Your application has been cancelled.', 'success');
          setApplications(prev => prev.map(app => app._id === id ? { ...app, status: 'rejected' } : app));
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  const handleEdit = (status, id) => {
    if (status !== 'pending') {
      return Swal.fire('Not Allowed', 'Cannot edit once application is processing/completed.', 'warning');
    }
    navigate(`/edit-application/${id}`);
  };

  const handleSubmitReview = async () => {
    if (!rating || !reviewText || !reviewModal) {
      return Swal.fire('Error', 'Rating and review text are required.', 'error');
    }

    setIsSubmittingReview(true);
    const application = applications.find(app => app._id === reviewModal);
    const reviewData = {
      scholarshipId: application.scholarshipId,
      scholarshipName: application.scholarshipInfo?.subject,
      universityName: application.scholarshipInfo?.university,
      reviewerName: user.name,
      reviewerEmail: user.email,
      rating,
      comment: reviewText,
      date: new Date(),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (data.insertedId) {
        Swal.fire('Success', 'Review submitted!', 'success');
        setReviewModal(null);
        setReviewText('');
        setRating(0);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to submit review.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg font-medium">Loading...</div>;
  if (!applications.length) return <div className="text-center py-10 text-lg text-gray-500">No applications found.</div>;

  return (
    <div className="overflow-x-auto mt-8 mb-16 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">My Applications</h2>

      <table className="table-auto w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
        <thead className="bg-indigo-50 text-sm uppercase text-gray-600">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">University</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Degree</th>
            <th className="px-4 py-3">Fee</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Applied</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {applications.map((app, i) => (
            <tr key={app._id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">{i + 1}</td>
              <td className="px-4 py-3">{app.scholarshipInfo?.university || 'N/A'}</td>
              <td className="px-4 py-3">{app.scholarshipInfo?.subject || 'N/A'}</td>
              <td className="px-4 py-3">{app.degree}</td>
              <td className="px-4 py-3">${app.applicationFees || '0'}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    app.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : app.status === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : app.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {app.status}
                </span>
              </td>
              <td className="px-4 py-3">{app.createdAt ? format(new Date(app.createdAt), 'PPP') : 'N/A'}</td>
              <td className="px-4 py-3 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => handleEdit(app.status, app._id)}
                  className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCancel(app._id)}
                  className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                >
                  Cancel
                </button>
                {app.status === 'completed' && (
                  <button
                    onClick={() => setReviewModal(app._id)}
                    className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Review
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">Submit Review</h3>

            <label className="block font-medium mb-1">Rating (1 to 5)</label>
            <input
              type="number"
              className="input input-bordered w-full mb-3"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min={1}
              max={5}
            />

            <label className="block font-medium mb-1">Comment</label>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReviewModal(null)}
                className="btn btn-sm btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
