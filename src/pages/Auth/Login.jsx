// src/pages/Auth/Login.jsx
import { useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth'; // ✅

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { auth, setRole } = useAuth();     // ✅ auth from context
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/';

  // fetch role → setRole → redirect
  const resolveRoleAndRedirect = async (userEmail) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userEmail}`
      );
      const { role = 'user' } = await res.json();
      setRole(role);
      navigate(`/dashboard/${role}`, { replace: true });
      Swal.fire('Success 🎉', 'Logged in successfully', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Could not fetch user role', 'error');
    }
  };

  // email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await resolveRoleAndRedirect(cred.user.email);
    } catch (err) {
      Swal.fire('Login failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      await resolveRoleAndRedirect(cred.user.email);
    } catch (err) {
      Swal.fire('Google login failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>

        {/* EMAIL / PASSWORD FORM */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <Link to="#" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-indigo-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* OR divider */}
        <div className="flex items-center my-6">
          <span className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <span className="flex-grow h-px bg-gray-300" />
        </div>

        {/* GOOGLE LOGIN */}
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
