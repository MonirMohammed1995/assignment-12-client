import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaImage } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { uploadImageToImgbb } from '../../utils/uploadImageToImgbb';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { app } from '../../firebase/firebase.config';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [image, setImage] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveUserToDB = async (name, email, role, imageUrl) => {
    const newUser = { name, email, role, image: imageUrl };

    await fetch(`${api}/users/${email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    const tokenRes = await fetch(`${api}/jwt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const { token } = await tokenRes.json();
    localStorage.setItem('access-token', token);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!image) {
      return Swal.fire('Error', 'Please upload a profile image!', 'error');
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImageToImgbb(image);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await updateProfile(userCredential.user, {
        displayName: form.name,
        photoURL: imageUrl,
      });

      await saveUserToDB(form.name, form.email, form.role, imageUrl);
      Swal.fire('Success!', 'Account created successfully', 'success');

      navigate(`/dashboard/${form.role}`);
    } catch (err) {
      Swal.fire('Registration Failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const imageUrl =
        user.photoURL || 'https://i.ibb.co/Y3bFBLT/default-user.png';

      await saveUserToDB(user.displayName, user.email, 'user', imageUrl);
      Swal.fire('Success!', 'Logged in with Google', 'success');

      navigate('/dashboard/user');
    } catch (err) {
      Swal.fire('Google Login Failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 min-h-[calc(100vh-80px)] bg-gradient-to-r from-indigo-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4 text-gray-700">
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600"
              tabIndex={-1}
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Image Upload */}
          <div className="relative">
            <FaImage className="absolute left-3 top-3 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <span className="h-px flex-1 bg-gray-300" />
          <span className="px-4 text-sm text-gray-500">or</span>
          <span className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border-2 border-blue-500 text-blue-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition"
        >
          <FaGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>

        {/* Login Link */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
