// src/context/AuthProvider.jsx
import { createContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load theme from localStorage or default to light
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Sync theme changes with localStorage and HTML tag
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle user state and fetch role from backend
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const api = import.meta.env.VITE_API_URL;
          const { data } = await axios.get(`${api}/users/role/${currentUser.email}`);
          setRole(data?.role || 'user');
        } catch (error) {
          console.error('Error fetching user role:', error.message);
          setRole('user'); // fallback to user role
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Error during logout:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    role,
    loading,
    theme,
    setTheme,
    logout,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
