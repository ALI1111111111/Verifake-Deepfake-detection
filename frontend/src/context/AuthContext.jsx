import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/user`)
        .then((res) => setUser(res.data));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const jwt = response.data.token;
      localStorage.setItem('token', jwt);
      setToken(jwt);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
