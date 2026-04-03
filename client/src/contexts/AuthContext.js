import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, googleLoginUser, getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    getMe(token)
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await loginUser({ username, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const googleLogin = async (credential) => {
    const res = await googleLoginUser({ credential });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (formData) => {
    const res = await registerUser(formData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
