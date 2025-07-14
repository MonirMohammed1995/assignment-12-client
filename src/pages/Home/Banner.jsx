import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import img1 from '../../assets/banner/banner1.jpg'
import img2 from '../../assets/banner/banner2.jpg'
import img3 from '../../assets/banner/banner3.jpg'
import img4 from '../../assets/banner/banner4.jpg'
import img5 from '../../assets/banner/banner5.jpg'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router';

const Banner = () => {
  const banners = [
    {
      id: 1,
      title: "Global Scholarships for Everyone",
      desc: "Discover worldwide scholarship opportunities tailored for you.",
      img: `${img1}`,
    },
    {
      id: 2,
      title: "Learn Without Limits",
      desc: "Apply for top scholarships and make your dream university a reality.",
      img: `${img2}`,
    },
    {
      id: 3,
      title: "Career-Ready Education",
      desc: "Gain access to institutions that shape future leaders.",
      img: `${img3}`,
    },
    {
      id: 4,
      title: "Study Abroad Made Easy",
      desc: "Find, apply, and track scholarships from across the globe.",
      img: `${img4}`,
    },
    {
      id: 5,
      title: "Empower Your Future",
      desc: "Take the first step towards a brighter tomorrow with ScholarSys.",
      img: `${img5}`,
    },
  ];

  return (
    <div className="pt-16 rounded-2xl">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={700}
        swipeable
        emulateTouch
      >
        {banners.map((banner) => (
          <div key={banner.id} className="relative rounded-2xl">
            <img
              src={banner.img}
              alt={banner.title}
              className="w-full h-[300px] md:h-[500px] object-cover rounded-2xl"
            />
            <div className="hero hero-overlay absolute inset-0 bg-opacity-40 flex flex-col justify-center items-center text-center px-4 rounded-2xl">
              <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
                {banner.title}
              </h2>
              <p className="text-white mt-2 text-sm md:text-lg max-w-xl drop-shadow">
                {banner.desc}
              </p>
              <Link to='/all-scholarships'><button className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition">
                Explore Scholarships
              </button></Link>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;