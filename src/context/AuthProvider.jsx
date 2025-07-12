import { createContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import axios from 'axios';
import { auth } from '../firebase/firebase.config.js';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🌗 Theme state
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  // ✅ 1. Get user role from backend
  const fetchUserRole = async (email) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/role/${email}`
      );
      setRole(data.role);
    } catch (err) {
      console.error('❌ Role fetch error:', err);
    }
  };

  // ✅ 2. Auth state monitor
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/jwt`,
            { email: currentUser.email }
          );
          localStorage.setItem('access-token', data.token);
          fetchUserRole(currentUser.email);
        } catch (err) {
          console.error('❌ JWT fetch error:', err);
        }
      } else {
        localStorage.removeItem('access-token');
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ 3. Theme sync with HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ✅ 4. Google Login (Fixed!)
  const googleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider(); // ✅ MUST use instance
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle user/token
    } catch (err) {
      console.error('❌ Google login error:', err);
      setLoading(false);
      throw err;
    }
  };

  // ✅ 5. Logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    role,
    loading,
    googleLogin,
    logout,
    theme,
    setTheme,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-indigo-600" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;