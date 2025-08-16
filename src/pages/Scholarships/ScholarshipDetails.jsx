import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import { FaStar } from 'react-icons/fa';

// ===== Skeleton Loader =====
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ===== Button Component =====
const Button = ({ children, onClick, type='primary', className='' }) => {
  const base = "px-6 py-2 rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md";
  const types = type==='primary'
    ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white hover:scale-105 hover:shadow-xl focus:ring-indigo-500"
    : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:scale-105 hover:shadow-lg focus:ring-yellow-400";
  return <button onClick={onClick} className={`${base} ${types} ${className}`}>{children}</button>;
};

// ===== Star Rating Component =====
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1 text-yellow-400">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
    ))}
  </div>
);

// ===== Review Card =====
const ReviewCard = ({ review }) => (
  <div className="p-5 bg-white border rounded-2xl shadow hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-4 mb-3">
      <img src={review.reviewerImage || '/default-avatar.png'} alt={review.reviewerName} className="w-14 h-14 rounded-full object-cover border" />
      <div>
        <p className="font-semibold text-gray-800 truncate">{review.reviewerName}</p>
        <p className="text-sm text-gray-500">{review.date ? format(new Date(review.date), 'PPP') : 'Date N/A'}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 mb-2">
      <StarRating rating={review.rating} />
      <span className="text-gray-600 ml-2 font-medium">{review.rating}/5</span>
    </div>
    <p className="text-gray-700 line-clamp-4">{review.comment}</p>
  </div>
);

// ===== Review Modal =====
const ReviewModal = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if(rating < 1 || rating > 5) return Swal.fire('Oops!','Select rating 1-5','warning');
    if(!comment.trim()) return Swal.fire('Oops!','Write a comment','warning');
    onSubmit({ rating, comment });
  };

  return (
    <dialog open className="modal modal-open" aria-modal="true" role="dialog">
      <div className="modal-box max-w-lg p-6 rounded-3xl bg-white shadow-lg">
        <h3 className="font-bold text-2xl mb-4 text-gray-800">Write a Review</h3>
        <label className="block mb-2 font-medium text-gray-700">Rating:</label>
        <select className="select select-bordered w-full mb-4" value={rating} onChange={e => setRating(Number(e.target.value))}>
          <option value={0} disabled>-- Select rating --</option>
          {[1,2,3,4,5].map(num => <option key={num} value={num}>{num} Star{num>1?'s':''}</option>)}
        </select>
        <label className="block mb-2 font-medium text-gray-700">Comment:</label>
        <textarea className="textarea textarea-bordered w-full mb-4" rows={4} placeholder="Write your review..." value={comment} onChange={e => setComment(e.target.value)} />
        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button type="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </dialog>
  );
};

// ===== Scholarship Info =====
const ScholarshipInfo = ({ scholarship, avgRating, reviewsLength, handleApply, openReview }) => {
  const { universityName, universityImage, universityCity, universityCountry, scholarshipCategory, subjectCategory, applicationFees, serviceCharge, stipend, deadline, postDate, description } = scholarship;
  const formattedDeadline = deadline ? format(new Date(deadline), 'PPP') : 'N/A';
  const formattedPostDate = postDate ? format(new Date(postDate), 'PPP') : 'N/A';

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <img src={universityImage || '/fallback-university.jpg'} alt={universityName} className="rounded-3xl w-full h-80 object-cover border shadow-lg" loading="lazy"/>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-gray-800">{universityName}</h2>
        <p className="text-gray-500">{universityCity}, {universityCountry}</p>

        <div className="space-y-1 text-gray-700 text-sm">
          <p><strong>Scholarship Category:</strong> {scholarshipCategory}</p>
          <p><strong>Subject Category:</strong> {subjectCategory}</p>
          <p><strong>Deadline:</strong> {formattedDeadline}</p>
          <p><strong>Application Fees:</strong> ${applicationFees || 'Free'}</p>
          <p><strong>Service Charge:</strong> ${serviceCharge || 'N/A'}</p>
          <p><strong>Stipend:</strong> {stipend || 'N/A'}</p>
          <p><strong>Posted On:</strong> {formattedPostDate}</p>
        </div>

        <p className="mt-3 font-medium text-yellow-500 text-lg flex items-center gap-2">
          ⭐ Average Rating: {avgRating}/5 ({reviewsLength} review{reviewsLength!==1?'s':''})
        </p>

        <div className="flex flex-wrap gap-3 mt-4">
          <Button onClick={handleApply}>Apply Now</Button>
          {openReview && <Button type="secondary" onClick={openReview}>Write a Review</Button>}
        </div>

        <div className="mt-6 bg-gray-50 p-6 rounded-3xl border shadow-inner">
          <h4 className="text-xl font-semibold mb-2 text-gray-800">📄 Scholarship Description</h4>
          <p className="text-gray-700 leading-relaxed">{description || 'No description provided.'}</p>
        </div>
      </div>
    </div>
  );
};

// ===== Main Component =====
const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [scholarship,setScholarship] = useState(null);
  const [reviews,setReviews] = useState([]);
  const [avgRating,setAvgRating] = useState(0);
  const [loading,setLoading] = useState(true);
  const [showReviewModal,setShowReviewModal] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const [schRes,revRes]=await Promise.all([
          fetch(`${api}/scholarships/${id}`),
          fetch(`${api}/reviews/scholarship/${id}`)
        ]);
        if(!schRes.ok) throw new Error('Scholarship not found');
        if(!revRes.ok) throw new Error('Reviews not found');

        const schData = await schRes.json();
        const revData = await revRes.json();

        setScholarship(schData);
        setReviews(revData||[]);

        if(revData?.length>0){
          const total = revData.reduce((sum,r)=>sum+(parseFloat(r.rating)||0),0);
          setAvgRating((total/revData.length).toFixed(1));
        } else setAvgRating(0);
      }catch(err){
        console.error(err);
        Swal.fire('Error', err.message, 'error');
      }finally{ setLoading(false); }
    };
    fetchData();
  },[id,api]);

  const handleApply=()=>{ if(!user) return navigate('/login'); navigate(`/checkout/${id}`); };
  const handleReviewSubmit=async({rating,comment})=>{
    if(!user){ Swal.fire('Unauthorized','Login first','warning'); setShowReviewModal(false); return; }
    try{
      const res = await fetch(`${api}/reviews`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          scholarshipId:id,
          scholarshipName:scholarship?.subjectCategory||'Scholarship',
          universityName:scholarship?.universityName||'University',
          universityImage:scholarship?.universityImage||'',
          reviewerName:user.displayName||user.email,
          reviewerEmail:user.email,
          reviewerImage:user.photoURL||null,
          rating,comment,date:new Date().toISOString()
        })
      });
      if(!res.ok) throw new Error('Failed to submit review');
      const newReview = await res.json();
      const updatedReviews = [...reviews,newReview];
      setReviews(updatedReviews);
      const total = updatedReviews.reduce((sum,r)=>sum+(parseFloat(r.rating)||0),0);
      setAvgRating((total/updatedReviews.length).toFixed(1));
      Swal.fire('Thank you','Review submitted','success');
      setShowReviewModal(false);
    }catch(err){ console.error(err); Swal.fire('Error',err.message||'Failed','error'); }
  };

  if(loading) return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <Skeleton className="h-6 w-3/5"/>
      <Skeleton className="h-6 w-2/5"/>
      <Skeleton className="h-72 w-full"/>
      <Skeleton className="h-6 w-2/5"/>
      <Skeleton className="h-4 w-1/3"/>
      <Skeleton className="h-4 w-1/4"/>
    </div>
  );

  if(!scholarship) return <div className="text-center py-10 text-red-600 text-xl">Scholarship not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <Helmet><title>Scholarship Details</title></Helmet>

      <ScholarshipInfo 
        scholarship={scholarship} 
        avgRating={avgRating} 
        reviewsLength={reviews.length} 
        handleApply={handleApply} 
        openReview={user?()=>setShowReviewModal(true):null}
      />

      <section className="mt-12">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">🗣️ Student Reviews</h3>
        {reviews.length > 0 ? (
          <Carousel
            arrows
            autoPlay
            autoPlaySpeed={4000}
            infinite
            responsive={{
              desktop:{breakpoint:{max:3000,min:1024},items:2},
              tablet:{breakpoint:{max:1024,min:640},items:1},
              mobile:{breakpoint:{max:640,min:0},items:1}
            }}
          >
            {reviews.map(r => <ReviewCard key={r._id} review={r}/>)}
          </Carousel>
        ) : <p className="text-gray-500">No reviews yet.</p>}
      </section>

      {showReviewModal && <ReviewModal onClose={()=>setShowReviewModal(false)} onSubmit={handleReviewSubmit}/>}
    </div>
  );
};

export default ScholarshipDetails;
