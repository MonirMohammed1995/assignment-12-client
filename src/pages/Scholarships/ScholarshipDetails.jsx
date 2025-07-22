import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [scholarship, setScholarship] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchScholarshipData = async () => {
      try {
        const [scholarshipRes, reviewsRes] = await Promise.all([
          fetch(`${api}/scholarships/${id}`),
          fetch(`${api}/reviews/${id}`),
        ]);

        const scholarshipData = await scholarshipRes.json();
        const reviewData = await reviewsRes.json();

        setScholarship(scholarshipData);
        setReviews(reviewData || []);

        if (reviewData?.length > 0) {
          const total = reviewData.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0);
          setAvgRating((total / reviewData.length).toFixed(1));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load scholarship details.', 'error');
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

  if (loading) return <div className="text-center py-10 text-lg font-medium">Loading scholarship details...</div>;
  if (!scholarship) return <div className="text-center py-10 text-red-600">Scholarship not found.</div>;

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
      {/* === Top Section: Scholarship Info === */}
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
            <p><strong>💰 Application Fees:</strong> {applicationFees || 'Free'} BDT</p>
            <p><strong>🔧 Service Charge:</strong> {serviceCharge || 'Not specified'} BDT</p>
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
        </div>
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
                    <p className="text-sm text-gray-500">{rev.date}</p>
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
    </div>
  );
};

export default ScholarshipDetails;
