import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to analyze');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      await api.post('/detect', formData);
      toast.success('File uploaded successfully');
      navigate('/results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex-grow">
        <h2 className="text-xl mb-4">Upload File</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button
            className="bg-green-500 text-white p-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>
    </div>
  );
}
