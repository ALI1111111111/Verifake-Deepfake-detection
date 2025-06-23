import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [service, setService] = useState('deepfake');
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
    formData.append('service', service);
    try {
      setLoading(true);
      await api.post('/detect', formData);
      toast.success('File uploaded successfully');
      navigate('/results');
    } catch (error) {
      toast.error('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-14">
      <Navbar />
      <div className="p-4 flex-grow">
        <h2 className="text-xl mb-4">Upload File</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="file"
            onChange={(e) => {
              const f = e.target.files[0];
              setFile(f);
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
          {preview && (
            <img src={preview} alt="preview" className="h-32 object-contain" />
          )}
          <select
            className="border p-2"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="deepfake">Deepfake</option>
            <option value="nudity">Nudity</option>
            <option value="face">Face</option>
          </select>
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
