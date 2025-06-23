import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Navbar from '../components/Navbar';


export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('All fields are required');
      return;
    }
    try {
      setLoading(true);
      await api.post('/auth/register', { name, email, password });
      toast.success('Registered successfully');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-14">
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 max-w-md mx-auto flex-grow">
        <h2 className="text-xl mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />
          <input
            className="border p-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <button className="bg-blue-500 text-white p-2 w-full rounded" disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
      </div>

      </div>
    </div>
  );
}
