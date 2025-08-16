import React from 'react';
import Banner from './Banner';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import ReviewStats from './ReviewStats';
import TopScholarships from '../Scholarships/TopScholarships';
import { Helmet } from 'react-helmet';
import Reviews from './Reviews';
import ScholarshipStats from './ScholarshipStats';

const Home = () => {
    return (
        <div>
            <Helmet><title>Home</title></Helmet>
            <div>
            <Banner/>
            <TopScholarships/>
            <Reviews/>
            <HowItWorks/>
            <WhyChooseUs/>
            <ScholarshipStats/>
            <ReviewStats/>
        </div>
        </div>
    );
};

export default Home;