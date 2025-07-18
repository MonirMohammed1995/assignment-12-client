import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import axios from 'axios';
import { app } from '../../firebase/firebase.config';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRedirectByRole = async (email) => {
    try {
      const api = import.meta.env.VITE_API_URL;
      const res = await axios.get(`${api}/users/role/${email}`);
      const role = res.data?.role || 'user';

      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (role === 'admin') {
        navigate('/dashboard/admin');
      } else if (role === 'moderator') {
        navigate('/dashboard/moderator');
      } else {
        navigate('/dashboard/user');
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login error',
        text: 'Could not determine user role. Redirecting to user dashboard.',
        confirmButtonColor: '#4F46E5',
      });
      navigate('/dashboard/user');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = result.user;
      Swal.fire({
        icon: 'success',
        title: 'Success 🎉',
        text: 'Logged in successfully',
        confirmButtonColor: '#4F46E5',
      });
      await handleRedirectByRole(user.email);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: err.message,
        confirmButtonColor: '#4F46E5',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      Swal.fire({
        icon: 'success',
        title: 'Success 🎉',
        text: 'Logged in with Google',
        confirmButtonColor: '#4F46E5',
      });
      await handleRedirectByRole(user.email);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Google login failed',
        text: err.message,
        confirmButtonColor: '#4F46E5',
      });
    } finally {
      setLoading(false);
    }
  };

  // Optional: redirect if already logged in
  useEffect(() => {
    if (auth.currentUser?.email) {
      handleRedirectByRole(auth.currentUser.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleEmailLogin} className="space-y-6 text-gray-600">
          <label htmlFor="email" className="sr-only">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <label htmlFor="password" className="sr-only">Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-indigo-600 font-medium"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-indigo-600 transition disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <span className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <span className="flex-grow h-px bg-gray-300" />
        </div>

        <button
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border-2 border-blue-500 text-blue-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition"
          aria-label="Sign in with Google"
        >
          <FaGoogle />
          {loading ? 'Please wait...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;
