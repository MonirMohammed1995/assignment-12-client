import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../../firebase/firebase.config';

const auth = getAuth(app); // Firebase auth instance
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEmailLogin = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      Swal.fire('Success 🎉', 'Logged in successfully', 'success');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      Swal.fire('Login failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      Swal.fire('Success 🎉', 'Logged in with Google', 'success');
      navigate('/dashboard/user');
    } catch (err) {
      Swal.fire('Google login failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleEmailLogin} className="space-y-6 text-gray-600">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-indigo-600 font-medium"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
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
        >
          <FaGoogle />
          {loading ? 'Please wait...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;
