import React from 'react';
import Navbar from '../components/shared/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/shared/Footer';

const Root = () => {
    return (
        <div>
            <Navbar/>
            <div className='max-w-11/12 mx-auto mt-6'>
            <Outlet/>
            </div>
            <Footer/>
        </div>
    );
};

export default Root;