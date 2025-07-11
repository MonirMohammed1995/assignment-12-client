import React from 'react';
import Banner from './Banner';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import ReviewStats from './ReviewStats';
import TopScholarship from '../Scholarships/TopScholarship';

const Home = () => {
    return (
        <div>
            <Banner/>
            <TopScholarship/>
            <HowItWorks/>
            <WhyChooseUs/>
            <ReviewStats/>
        </div>
    );
};

export default Home;