import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Navbar from '../components/Navbar';
import FacePreview from '../components/FacePreview';
import Dropzone from '../components/Dropzone';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [service, setService] = useState('deepfake');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_at');

  useEffect(() => {
    api
      .get('/analyses')
      .then((res) => setResults(res.data))
      .catch(() => toast.error('Failed to load results'));
  }, []);

  const filtered = results
    .filter((r) =>
      r.service.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === 'created_at'
        ? new Date(b.created_at) - new Date(a.created_at)
        : a.service.localeCompare(b.service)
    );

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
      setProgress(25);
      const { data } = await api.post('/detect', formData);
      setProgress(100);
      toast.success('File analyzed');
      setResults((prev) => [data, ...prev]);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-14">
      <Navbar />
      <div className="p-4 flex-grow container mx-auto max-w-5xl space-y-6">
        <h2 className="text-2xl mb-4 font-semibold text-center">Analyze File</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow-md">
          <Dropzone
            onFile={(f) => {
              setFile(f);
              setPreview(URL.createObjectURL(f));
            }}
            preview={preview}
          />
          <select
            className="border p-2"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="deepfake">Deepfake</option>
            <option value="face">Face</option>
            <option value="wad">Weapons/Alcohol/Drugs</option>
            <option value="offensive">Offensive</option>
            <option value="properties">Properties</option>
            <option value="celebrity">Celebrity</option>
          </select>
          <Button disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
          {progress > 0 && (
            <progress value={progress} max="100" className="w-full h-2" />
          )}
        </form>

        <div className="flex items-center mt-6 gap-2">
          <input
            className="border p-2 flex-grow rounded"
            placeholder="Search by service"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="border p-2 rounded" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="created_at">Newest</option>
            <option value="service">Service</option>
          </select>
        </div>

        {results.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg mb-2 font-medium">Recent Results</h3>
            <table className="min-w-full text-sm border bg-white rounded shadow divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-2 py-1 text-left">Preview</th>
                  <th className="border border-gray-200 px-2 py-1 text-left">Service</th>
                  <th className="border border-gray-200 px-2 py-1 text-left">Result</th>
                  <th className="border border-gray-200 px-2 py-1 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="odd:bg-gray-50">
                    <td className="border border-gray-200 px-2 py-1 text-center">
                      {item.service === 'face' ? (
                        <FacePreview
                          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${item.file_path}`}
                          faces={item.result?.faces}
                        />
                      ) : (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${item.file_path}`}
                          alt="preview"
                          className="h-12 mx-auto"
                        />
                      )}
                    </td>
                    <td className="border border-gray-200 px-2 py-1">{item.service}</td>
                    <td className="border border-gray-200 px-2 py-1">
                      {(() => {
                        if (item.service === 'deepfake') {
                          return item.result?.score > 0.5
                            ? 'Likely Fake'
                            : 'Likely Real';
                        }
                        if (item.service === 'face') {
                          const count = item.result?.faces?.length ?? 0;
                          return count === 0 ? 'No face' : `${count} face(s)`;
                        }
                        if (item.service === 'wad') {
                          const w = item.result || {};
                          return `Weapon ${w.weapon ?? 0}, Alcohol ${w.alcohol ?? 0}, Drugs ${w.drugs ?? 0}`;
                        }
                        if (item.service === 'offensive') {
                          const off = item.result?.offensive?.prob ?? null;
                          return off === null ? '-' : `${Math.round(off * 100)}% offensive`;
                        }
                        if (item.service === 'properties') {
                          return `${item.result?.width}x${item.result?.height}`;
                        }
                        if (item.service === 'celebrity') {
                          const names = item.result?.celebrities?.map((c) => c.name).join(', ');
                          return names || 'None';
                        }
                        return '-';
                      })()}
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
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
