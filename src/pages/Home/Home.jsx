import React from 'react';
import Banner from './Banner';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import ReviewStats from './ReviewStats';

const Home = () => {
    return (
        <div>
            <Banner/>
            <HowItWorks/>
            <WhyChooseUs/>
            <ReviewStats/>
        </div>
    );
};

export default Home;