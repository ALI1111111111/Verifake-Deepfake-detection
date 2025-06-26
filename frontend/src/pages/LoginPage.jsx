import { useState } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/Button';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    try {
      await login(email, password);
    } catch {
      // error toast handled by interceptor
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-14 bg-[url('https://source.unsplash.com/featured/?security')] bg-cover">
      <Navbar />
      <div className="p-4 max-w-md mx-auto flex-grow backdrop-blur-md bg-white/70 dark:bg-gray-800/70 rounded">
        <h2 className="text-xl mb-4 text-center font-semibold">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="border p-2 w-full"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>
        <p className="mt-4 text-center">
          <a href="/register" className="text-indigo-700 dark:text-indigo-300 underline">
            Need an account? Register
          </a>
        </p>
      </div>
    </div>
  );
}
