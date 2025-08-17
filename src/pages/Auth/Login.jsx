import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';
import { app } from '../../firebase/firebase.config';
import { Helmet } from 'react-helmet';

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
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(`${api}/users/role/${email}`, { headers: { Authorization: `Bearer ${token}` } });
      const role = res.data?.role || 'user';

      if (redirectPath) navigate(redirectPath, { replace: true });
      else if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'moderator') navigate('/dashboard/moderator');
      else navigate('/dashboard/user');
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Login error', text: 'Could not determine user role. Redirecting to user dashboard.', confirmButtonColor: '#4F46E5' });
      navigate('/dashboard/user');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = result.user;

      const api = import.meta.env.VITE_API_URL;
      const { data } = await axios.post(`${api}/jwt`, { email: user.email });
      localStorage.setItem('accessToken', data.token);

      Swal.fire({ icon: 'success', title: 'Success 🎉', text: 'Logged in successfully', confirmButtonColor: '#4F46E5' });
      await handleRedirectByRole(user.email);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Login failed', text: err.message, confirmButtonColor: '#4F46E5' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const api = import.meta.env.VITE_API_URL;
      const { data } = await axios.post(`${api}/jwt`, { email: user.email });
      localStorage.setItem('accessToken', data.token);

      Swal.fire({ icon: 'success', title: 'Success 🎉', text: 'Logged in with Google', confirmButtonColor: '#4F46E5' });
      await handleRedirectByRole(user.email);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Google login failed', text: err.message, confirmButtonColor: '#4F46E5' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.currentUser?.email) handleRedirectByRole(auth.currentUser.email);
  }, []);

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-gradient-to-r from-gray-100 to-indigo-100 p-4">
      <Helmet><title>Login</title></Helmet>

      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">Welcome Back</h2>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-indigo-600 font-medium"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-60"
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
        >
          <FaGoogle />
          {loading ? 'Please wait...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;
