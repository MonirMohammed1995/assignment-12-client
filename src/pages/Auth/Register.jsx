import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import Swal from "sweetalert2";
import { FaEnvelope, FaLock, FaUser, FaGoogle } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // Email / Password Register
  // ---------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create user with email & password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      await updateProfile(userCredential.user, { displayName: name });

      Swal.fire("Success!", "Registration successful", "success");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Google Sign‑In
  // ---------------------------
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      Swal.fire("Success!", "Logged in with Google", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
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

        {/* Email / Password Form */}
        <form onSubmit={handleRegister} className="space-y-6 text-gray-700">
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-semibold hover:text-indigo-800 focus:outline-none"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <span className="h-px flex-1 bg-gray-300" />
          <span className="px-4 text-sm text-gray-500">or</span>
          <span className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Google Sign‑In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FaGoogle className="text-xl text-gray-600" />
          <span className="text-gray-700">Continue with Google</span>
        </button>

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="login" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;