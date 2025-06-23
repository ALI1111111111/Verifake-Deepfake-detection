import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [service, setService] = useState('deepfake');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    api
      .get('/analyses')
      .then((res) => setResults(res.data))
      .catch(() => toast.error('Failed to load results'));
  }, []);

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
      const { data } = await api.post('/detect', formData);
      toast.success('File analyzed');
      setResults((prev) => [data, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-14">
      <Navbar />
      <div className="p-4 flex-grow container mx-auto">
        <h2 className="text-xl mb-4 font-semibold">Analyze File</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md">
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

        {results.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg mb-2 font-medium">Recent Results</h3>
            <table className="min-w-full text-sm border bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Preview</th>
                  <th className="border px-2 py-1">Service</th>
                  <th className="border px-2 py-1">Result</th>
                  <th className="border px-2 py-1">Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item.id} className="odd:bg-gray-100">
                    <td className="border px-2 py-1">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${item.file_path}`}
                        alt="preview"
                        className="h-12 mx-auto"
                      />
                    </td>
                    <td className="border px-2 py-1">{item.service}</td>
                    <td className="border px-2 py-1">
                      {item.result?.score === undefined
                        ? '-'
                        : item.result.score > 0.5
                        ? 'Likely Fake'
                        : 'Likely Real'}
                    </td>
                    <td className="border px-2 py-1">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
