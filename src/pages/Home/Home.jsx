import React from 'react';
import Banner from './Banner';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import TopScholarships from '../Scholarships/TopScholarships';
import { Helmet } from 'react-helmet';
import Reviews from './Reviews';
import ScholarshipStats from './ScholarshipStats';
import Newsletter from './Newsletter';
import FeaturedProducts from './FeaturedProducts';
import SalesPromotion from './SalesPromotion';

const Home = () => {
    return (
        <div>
            <Helmet><title>Home</title></Helmet>
            <div>
            <Banner/>
            <TopScholarships/>
            <FeaturedProducts/>
            <Reviews/>
            <HowItWorks/>
            <Newsletter/>
            <WhyChooseUs/>
            <SalesPromotion/>
            <ScholarshipStats/>
        </div>
        </div>
    );
};

export default Home;