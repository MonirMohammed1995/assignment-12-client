import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { FaEnvelope, FaLock, FaUser, FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth'; // ✅ Custom auth hook

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { auth, setRole: setContextRole } = useAuth(); // ✅ Now auth is available
  const navigate = useNavigate();

  const saveUserToDB = async (name, email, role) => {
    const api = import.meta.env.VITE_API_URL;
    const newUser = { name, email, role };
    await fetch(`${api}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await saveUserToDB(name, email, role);
      setContextRole(role);
      Swal.fire('Success!', 'Registration successful', 'success');
      navigate(`/dashboard/${role}`);
    } catch (err) {
      Swal.fire('Registration failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUserToDB(result.user.displayName, result.user.email, 'user');
      setContextRole('user');
      Swal.fire('Success!', 'Logged in with Google', 'success');
      navigate('/dashboard/user');
    } catch (err) {
      Swal.fire('Google sign-in failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-blue-200 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-6 text-gray-700">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-medium"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          <select
            className="w-full border border-gray-300 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <span className="h-px flex-1 bg-gray-300" />
          <span className="px-4 text-sm text-gray-500">or</span>
          <span className="h-px flex-1 bg-gray-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border-2 border-blue-500 text-blue-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition"
        >
          <FaGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>

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
