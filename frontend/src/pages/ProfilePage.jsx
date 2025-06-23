import { useAuthContext } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}
