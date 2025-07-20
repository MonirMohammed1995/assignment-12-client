import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const ScholarshipDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/scholarships/${id}`)
      .then(res => res.json())
      .then(data => setScholarship(data));

    fetch(`${import.meta.env.VITE_API_URL}/reviews/${id}`)
      .then(res => res.json())
      .then(data => setReviews(data));
  }, [id]);

  const handleApply = () => {
    if (!user) return navigate('/login');
    navigate(`/checkout/${id}`);
  };

  if (!scholarship) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <img src={scholarship.universityImage} alt="University" className="rounded-xl w-full h-64 object-cover" />
        <div>
          <h2 className="text-3xl font-bold mb-2">{scholarship.universityName}</h2>
          <p className="text-gray-600">📍 {scholarship.universityLocation}</p>
          <p><strong>Category:</strong> {scholarship.scholarshipCategory}</p>
          <p><strong>Subject:</strong> {scholarship.subjectCategory}</p>
          <p><strong>Deadline:</strong> {scholarship.applicationDeadline}</p>
          <p><strong>Stipend:</strong> {scholarship.stipend || 'Not mentioned'}</p>
          <p><strong>Post Date:</strong> {scholarship.postDate}</p>
          <p><strong>Service Charge:</strong> {scholarship.serviceCharge} BDT</p>
          <p><strong>Application Fees:</strong> {scholarship.applicationFees} BDT</p>
          <button onClick={handleApply} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
            Apply Scholarship
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Scholarship Description</h3>
        <p className="text-gray-700 leading-relaxed">{scholarship.description}</p>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Student Reviews</h3>
        {reviews.length > 0 ? (
          <Carousel
            additionalTransfrom={0}
            arrows
            autoPlay
            autoPlaySpeed={4000}
            centerMode={false}
            className=""
            containerClass="carousel-container"
            dotListClass=""
            draggable
            infinite
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={{
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
              tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
              mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
            }}
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
          >
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 border rounded-xl m-2 shadow-sm bg-white">
                <div className="flex items-center gap-4 mb-2">
                  <img src={rev.reviewerImage} alt="reviewer" className="w-12 h-12 rounded-full" />
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
          <p className="text-gray-500">No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default ScholarshipDetails;