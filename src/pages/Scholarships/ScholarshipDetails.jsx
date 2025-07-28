import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';

const ReviewModal = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating < 1 || rating > 5) {
      Swal.fire('Oops!', 'Please select a rating between 1 and 5.', 'warning');
      return;
    }
    if (!comment.trim()) {
      Swal.fire('Oops!', 'Please write a comment.', 'warning');
      return;
    }
    onSubmit({ rating, comment });
  };

  return (
    <dialog open className="modal modal-open" aria-modal="true" role="dialog" aria-labelledby="review-modal-title">
      <div className="modal-box max-w-lg">
        <h3 id="review-modal-title" className="font-bold text-lg mb-4">Write a Review</h3>

        <label className="block mb-2 font-semibold">Rating:</label>
        <select
          className="select select-bordered w-full mb-4"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          aria-label="Select rating"
        >
          <option value={0} disabled>-- Select rating --</option>
          {[1,2,3,4,5].map(num => (
            <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
          ))}
        </select>

        <label className="block mb-2 font-semibold">Comment:</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows={4}
          placeholder="Write your review here..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <div className="modal-action mt-4">
          <button className="btn btn-primary" onClick={handleSubmit}>Submit Review</button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </dialog>
  );
};

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [scholarship, setScholarship] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const api = import.meta.env.VITE_API_URL;

  // Fetch scholarship & reviews
  useEffect(() => {
    const fetchScholarshipData = async () => {
      try {
        const [scholarshipRes, reviewsRes] = await Promise.all([
          fetch(`${api}/scholarships/${id}`),
          fetch(`${api}/reviews/scholarship/${id}`),
        ]);

        if (!scholarshipRes.ok) throw new Error('Scholarship not found');
        if (!reviewsRes.ok) throw new Error('Reviews not found');

        const scholarshipData = await scholarshipRes.json();
        const reviewData = await reviewsRes.json();

        setScholarship(scholarshipData);
        setReviews(reviewData || []);

        if (reviewData?.length > 0) {
          const total = reviewData.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0);
          setAvgRating((total / reviewData.length).toFixed(1));
        } else {
          setAvgRating(0);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        Swal.fire('Error', error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarshipData();
  }, [id, api]);

  const handleApply = () => {
    if (!user) return navigate('/login');
    navigate(`/checkout/${id}`);
  };

  // Submit new review to backend
  const handleReviewSubmit = async ({ rating, comment }) => {
  if (!user) {
    Swal.fire('Unauthorized', 'Please login to submit a review.', 'warning');
    setShowReviewModal(false);
    return;
  }

  try {
    const res = await fetch(`${api}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token header here if your backend uses verifyToken
      },
      body: JSON.stringify({
        scholarshipId: id,
        scholarshipName: scholarship?.subjectCategory || 'Scholarship', // Optional fallback
        universityName: scholarship?.universityName || 'University',
        universityImage: scholarship?.universityImage || '',
        reviewerName: user.displayName || user.email,
        reviewerEmail: user.email,
        reviewerImage: user.photoURL || null,
        rating,
        comment,
        date: new Date().toISOString(),
      }),
    });

    if (!res.ok) throw new Error('Failed to submit review.');

    const newReview = await res.json();

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);

    const total = updatedReviews.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0);
    setAvgRating((total / updatedReviews.length).toFixed(1));

    Swal.fire('Thank you!', 'Your review has been submitted.', 'success');
    setShowReviewModal(false);
  } catch (error) {
    console.error('Review submission error:', error);
    Swal.fire('Error', error.message || 'Failed to submit review.', 'error');
  }
};


  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-medium">
        Loading scholarship details...
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="text-center py-10 text-red-600">
        Scholarship not found.
      </div>
    );
  }

  const {
    universityName,
    universityImage,
    universityCountry,
    universityCity,
    scholarshipCategory,
    subjectCategory,
    applicationFees,
    serviceCharge,
    stipend,
    deadline,
    postDate,
    description,
  } = scholarship;

  const formattedDeadline = deadline ? format(new Date(deadline), 'PPP') : 'N/A';
  const formattedPostDate = postDate ? format(new Date(postDate), 'PPP') : 'N/A';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Helmet><title>Scholarship Details</title></Helmet>
      {/* === Scholarship Info === */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <img
          src={universityImage || '/fallback-university.jpg'}
          alt={universityName}
          className="rounded-xl w-full h-64 object-cover border shadow-md"
          loading="lazy"
        />
        <div>
          <h2 className="text-3xl font-bold text-neutral mb-2">{universityName}</h2>
          <p className="text-gray-600 mb-2">📍 {universityCity}, {universityCountry}</p>
          <div className="space-y-1 text-sm text-gray-700">
            <p><strong>🎓 Scholarship Category:</strong> {scholarshipCategory}</p>
            <p><strong>📚 Subject Category:</strong> {subjectCategory}</p>
            <p><strong>⏳ Deadline:</strong> {formattedDeadline}</p>
            <p><strong>💰 Application Fees:</strong>$ {applicationFees || 'Free'}</p>
            <p><strong>🔧 Service Charge:</strong>$ {serviceCharge || 'Not specified'}</p>
            <p><strong>🎁 Stipend:</strong> {stipend || 'Not mentioned'}</p>
            <p><strong>📅 Posted On:</strong> {formattedPostDate}</p>
          </div>

          <p className="mt-3 text-yellow-600 font-medium">
            ⭐ Average Rating: {avgRating}/5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
          </p>

          <button
            onClick={handleApply}
            className="mt-5 inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition duration-200"
          >
            Apply for Scholarship
          </button>

          {/* New Review Button */}
          {user && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="mt-3 ml-4 inline-block px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition duration-200"
            >
              Write a Review
            </button>
          )}
        </div>
      </div>

      {/* === Description === */}
      <div className="mt-10 bg-gray-50 p-6 rounded-xl border text-gray-700 leading-relaxed">
        <h4 className="text-xl font-semibold mb-3 text-neutral">📄 Scholarship Description</h4>
        <p>{description || 'No description provided.'}</p>
      </div>

      {/* === Reviews Section === */}
      <section className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">🗣️ Student Reviews</h3>
        {reviews.length > 0 ? (
          <Carousel
            arrows
            autoPlay
            autoPlaySpeed={4000}
            infinite
            responsive={{
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
              tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
              mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
            }}
          >
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-4 border rounded-xl m-2 shadow-sm bg-white"
              >
                <div className="flex items-center gap-4 mb-2">
                  <img
                    src={rev.reviewerImage || '/default-avatar.png'}
                    alt={rev.reviewerName}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-semibold">{rev.reviewerName}</p>
                    <p className="text-sm text-gray-500">
  {rev.date ? format(new Date(rev.date), 'PPP') : 'Date not available'}
</p>

                  </div>
                </div>
                <p className="text-yellow-500 font-bold">Rating: {rev.rating}/5</p>
                <p className="mt-2 text-gray-700">{rev.comment}</p>
              </div>
            ))}
          </Carousel>
        ) : (
          <p className="text-gray-500">No reviews available yet.</p>
        )}
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default ScholarshipDetails;
