import { useState } from 'react';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
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
        <button disabled={loading} className="bg-blue-500 text-white p-2 w-full">
          Login
        </button>
      </form>
<<<<<<< HEAD
      <p className="mt-4 text-center">
        <a href="/register" className="text-blue-500 underline">
          Need an account? Register
        </a>
      </p>
=======
>>>>>>> main
    </div>
  );
}
