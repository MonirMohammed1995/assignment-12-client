import React from 'react';
import Banner from './Banner';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import ReviewStats from './ReviewStats';
import TopScholarships from '../Scholarships/TopScholarships';

const Home = () => {
    return (
        <div>
            <Banner/>
            <TopScholarships/>
            <HowItWorks/>
            <WhyChooseUs/>
            <ReviewStats/>
        </div>
    );
};

export default Home;