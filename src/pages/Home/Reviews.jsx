import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, UserCircle, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our <span className="text-primary">Users Say</span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Real experiences shared by our applicants and students.  
            Their voices inspire us to keep improving.
          </p>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet.</p>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={review._id || index}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur shadow-md rounded-2xl p-7 border border-gray-100 
                            hover:shadow-xl hover:scale-[1.02] transition duration-300 h-full"
                >
                  {/* Reviewer Info */}
                  <div className="flex items-center gap-3 mb-5">
                    <UserCircle className="w-12 h-12 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {review.reviewerName || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {review.reviewerEmail}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-3 w-6 h-6 text-primary/20" />
                    <p className="text-gray-700 leading-relaxed italic pl-5">
                      {review.comment}
                    </p>
                  </div>

                  {/* Scholarship Info */}
                  <p className="mt-6 text-xs text-gray-400">
                    Scholarship ID: {review.scholarshipId}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Reviews;
