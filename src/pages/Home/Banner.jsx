import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import img1 from '../../assets/banner/banner1.jpg';
import img2 from '../../assets/banner/banner2.jpg';
import img3 from '../../assets/banner/banner3.jpg';
import img4 from '../../assets/banner/banner4.jpg';
import img5 from '../../assets/banner/banner5.jpg';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const banners = [
  {
    id: 1,
    title: "Global Scholarships for Everyone",
    desc: "Discover worldwide scholarship opportunities tailored for you.",
    img: img1,
  },
  {
    id: 2,
    title: "Learn Without Limits",
    desc: "Apply for top scholarships and make your dream university a reality.",
    img: img2,
  },
  {
    id: 3,
    title: "Career-Ready Education",
    desc: "Gain access to institutions that shape future leaders.",
    img: img3,
  },
  {
    id: 4,
    title: "Study Abroad Made Easy",
    desc: "Find, apply, and track scholarships from across the globe.",
    img: img4,
  },
  {
    id: 5,
    title: "Empower Your Future",
    desc: "Take the first step towards a brighter tomorrow with ScholarSys.",
    img: img5,
  },
];

const Banner = () => {
  return (
    <div className="pt-16">
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
          <div key={banner.id} className="relative w-full rounded-2xl overflow-hidden">
            {/* Background Image */}
            <img
              src={banner.img}
              alt={banner.title}
              className="w-full h-[350px] md:h-[550px] lg:h-[650px] object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40 flex flex-col justify-center items-center text-center px-6 md:px-12">
              
              {/* Animated Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white text-2xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-xl"
              >
                {banner.title}
              </motion.h2>

              {/* Animated Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white mt-4 md:mt-6 text-sm md:text-lg lg:text-xl max-w-2xl drop-shadow-md"
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
                  <button className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                    Explore Scholarships
                  </button>
                </Link>
              </motion.div>

            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
