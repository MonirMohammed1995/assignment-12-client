// src/context/AuthProvider.jsx
import { createContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../firebase/firebase.config'; // ✅ Import initialized app

export const AuthContext = createContext();
const auth = getAuth(app); // ✅ Use the initialized app

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${currentUser.email}`);
          const data = await res.json();
          setRole(data?.role || 'user');
        } catch (err) {
          console.error('Failed to fetch role:', err);
          setRole('user');
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout, auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
