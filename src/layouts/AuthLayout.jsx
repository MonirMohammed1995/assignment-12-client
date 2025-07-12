import React from 'react';
import { Outlet } from 'react-router';
import loginImage from '../assets/images/login.jpg'
import Navbar from '../components/shared/Navbar';

const AuthLayout = () => {
    return (
        <div className='flex justify-center items-center bg-blue-200'>
            <Navbar/>
            <img src={loginImage} alt=""  className='max-w-2xl p-4 rounded-4xl'/>
            <div>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default AuthLayout;