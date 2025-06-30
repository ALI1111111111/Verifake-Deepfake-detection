import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../ProfilePage.css'; // Add this import!

export default function ProfilePage() {
  const { user, setUser } = useAuthContext();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  if (!user) return null;

  return (
    <div className="profile-main">
      <Navbar />
      <section className="profile-section">
        <h2>Your Profile</h2>
        <div className="profile-usage">
          API Usage:&nbsp;
          <span style={{ fontWeight: 700 }}>
            {user.api_usage} / {user.api_limit}
          </span>
        </div>
        <form className="profile-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const { data } = await api.put('/user', { name, email, password });
            setUser(data);
          }}
        >
          <div>
            <label>Name</label>
            <input
              value={user.name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder='{user.name}'
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              value={user.email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label>Password <span style={{ fontWeight: 400, fontSize: "0.95em" }}>(leave blank to keep current)</span></label>
            <input
              type="password"
              value={user.password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          <button className="profile-btn" type="submit" style={{ padding: '12px 16px' }} > 
            Save Changes
          </button>
        </form>
      </section>
    </div>
  );
}
