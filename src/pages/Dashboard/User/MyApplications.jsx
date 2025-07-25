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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!applications.length) return <div className="text-center py-10">No applications found.</div>;

  return (
    <div className="overflow-x-auto mt-5 mb-16">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Applications</h2>
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200 text-base text-center">
            <th>#</th>
            <th>University</th>
            <th>Subject</th>
            <th>Degree</th>
            <th>Fee</th>
            <th>Status</th>
            <th>Applied</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, i) => (
            <tr key={app._id} className="text-center">
              <td>{i + 1}</td>
              <td>{app.scholarshipInfo?.university || 'N/A'}</td>
              <td>{app.scholarshipInfo?.subject || 'N/A'}</td>
              <td>{app.degree}</td>
              <td>${app.applicationFees || '0'}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    app.status === 'pending'
                      ? 'bg-yellow-200 text-yellow-800'
                      : app.status === 'processing'
                      ? 'bg-blue-200 text-blue-800'
                      : app.status === 'completed'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {app.status}
                </span>
              </td>
              <td>
                {app.createdAt ? format(new Date(app.createdAt), 'PPP') : 'N/A'}
              </td>
              <td className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => handleEdit(app.status, app._id)}
                  className="btn btn-sm btn-warning"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCancel(app._id)}
                  className="btn btn-sm btn-error"
                >
                  Cancel
                </button>
                {app.status === 'completed' && (
                  <button
                    onClick={() => setReviewModal(app._id)}
                    className="btn btn-sm btn-primary"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <h3 className="text-lg font-semibold mb-2">Submit Review</h3>
            <label className="label">
              <span className="label-text">Rating (1 to 5)</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min={1}
              max={5}
            />
            <label className="label mt-2">
              <span className="label-text">Comment</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setReviewModal(null)}
                className="btn btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="btn btn-sm btn-primary"
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