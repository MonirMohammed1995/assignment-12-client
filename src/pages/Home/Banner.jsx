import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const banners = [
  { id: 1, title: "Global Scholarships for Everyone", desc: "Discover worldwide scholarship opportunities tailored for you.", img: "https://i.postimg.cc/wj3kBL4H/photo-1601742638130-f76cbe00ad01.avif" },
  { id: 2, title: "Learn Without Limits", desc: "Apply for top scholarships and make your dream university a reality.", img: "https://i.postimg.cc/y6v9SWZN/photo-1617805784118-3c6a4b920c8d.avif" },
  { id: 3, title: "Career-Ready Education", desc: "Gain access to institutions that shape future leaders.", img: "https://i.postimg.cc/ncXsj2xd/photo-1659080925666-16001612bc3e.avif" },
  { id: 4, title: "Study Abroad Made Easy", desc: "Find, apply, and track scholarships from across the globe.", img: "https://i.postimg.cc/QdLMBr0t/photo-1619467416348-6a782839e95f.avif" },
  { id: 5, title: "Empower Your Future", desc: "Take the first step towards a brighter tomorrow with ScholarSys.", img: "https://i.postimg.cc/rsBqtSGb/photo-1634252701528-769062298807.avif" },
];

const Banner = () => {
  return (
    <div className="pt-16 relative">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={800}
        swipeable
        emulateTouch
      >
        {banners.map((banner) => (
          <div key={banner.id} className="relative w-full">
            {/* Background Image */}
            <img
              src={banner.img}
              alt={banner.title}
              className="w-full h-[450px] md:h-[600px] lg:h-[700px] object-cover"
            />

            {/* Overlay & Caption */}
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-6 md:p-12 max-w-3xl text-center">
                
                {/* Animated Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-white text-2xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-lg"
                >
                  {banner.title}
                </motion.h2>

                {/* Animated Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-gray-200 mt-4 md:mt-6 text-sm md:text-lg lg:text-xl max-w-xl mx-auto drop-shadow-md"
                >
                  {banner.desc}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Link to="/all-scholarships">
                    <button className="mt-6 px-10 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                      Explore Scholarships
                    </button>
                  </Link>
                </motion.div>

              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
