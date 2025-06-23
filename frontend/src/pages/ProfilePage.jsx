import Navbar from '../components/Navbar';
import { useAuthContext } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex-grow">
        <h2 className="text-xl mb-4">Profile</h2>
        <div className="bg-white shadow rounded p-4 max-w-md mx-auto">
          <p className="mb-2">
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
