import { createContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import axios from 'axios';
import app from '../firebase/firebase.config.js';

export const AuthContext = createContext(null)
const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // dark/light theme
  const [theme, setTheme] = useState('light');

  // fetch user role from DB
  const fetchUserRole = async (email) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/role/${email}`
      );
      setRole(res.data.role);
    } catch (err) {
      console.error('Role fetch error:', err);
    }
  };

  // monitor auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // JWT fetch
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/jwt`,
          { email: currentUser.email }
        );
        localStorage.setItem('access-token', res.data.token);
        fetchUserRole(currentUser.email);
      } else {
        localStorage.removeItem('access-token');
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // dark/light theme persistence
  useEffect(() => {
    const stored = localStorage.getItem('theme') || 'light';
    setTheme(stored);
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // logout
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // google login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const authInfo = {
    user,
    loading,
    logout,
    googleLogin,
    role,
    theme,
    setTheme,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
