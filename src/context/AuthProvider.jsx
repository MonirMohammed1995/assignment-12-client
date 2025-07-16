// src/context/AuthProvider.jsx
import { createContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { app } from '../firebase/firebase.config';

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser?.email) {
        setUser(currentUser);
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/jwt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email }),
          });
          const { token } = await res.json();
          if (token) {
            localStorage.setItem('token', token);
            const { role = 'user' } = JSON.parse(atob(token.split('.')[1]));
            setRole(role);
          } else {
            setRole('user');
          }
        } catch {
          setRole('user');
        }
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    role,
    loading,
    logout,
    auth,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;