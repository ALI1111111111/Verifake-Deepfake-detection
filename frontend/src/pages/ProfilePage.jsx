import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { user, setUser } = useAuthContext();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');


  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen pt-14">
      <Navbar />
      <div className="p-4 flex-grow">
        <h2 className="text-xl mb-4">Profile</h2>
        <div className="bg-white shadow rounded p-4 max-w-md mx-auto space-y-3">
          <p className="text-sm text-gray-600">API Usage: {user.api_usage} / {user.api_limit}</p>
          <div>
            <label className="block text-sm">Name</label>
            <input
              className="border p-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input
              className="border p-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              className="border p-2 w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={async () => {
              const { data } = await api.put('/user', { name, email, password });
              setUser(data);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

