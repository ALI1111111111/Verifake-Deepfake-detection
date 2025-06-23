import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/detect`, formData);
    setLoading(false);
    navigate('/results');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Upload File</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="bg-green-500 text-white p-2" disabled={loading}>
          Analyze
        </button>
      </form>
    </div>
  );
}
