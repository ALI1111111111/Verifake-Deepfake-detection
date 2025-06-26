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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col pt-16">
      <Navbar />
      <div className="container mx-auto flex-grow p-6">
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 max-w-3xl mx-auto mt-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-tight">Analyze Your File</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Dropzone
              onFile={(f) => {
                setFile(f);
                setPreview(URL.createObjectURL(f));
              }}
              preview={preview}
            />
            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="border border-blue-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 flex-1"
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
              <Button disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-purple-600 transition">
                {loading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
            {progress > 0 && (
              <progress value={progress} max="100" className="w-full h-2 rounded bg-blue-100" />
            )}
          </form>
        </div>

        <div className="flex flex-col md:flex-row items-center mt-10 gap-4 max-w-3xl mx-auto">
          <input
            className="border border-blue-200 rounded-lg p-2 flex-grow focus:ring-2 focus:ring-blue-400"
            placeholder="Search by service"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="border border-blue-200 rounded-lg p-2" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="created_at">Newest</option>
            <option value="service">Service</option>
          </select>
        </div>

        {results.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4 text-center">Recent Results</h3>
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <table className="min-w-full text-sm bg-white/90 dark:bg-gray-900/90 rounded-xl">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900">
                    <th className="border-b px-4 py-3 font-semibold">Preview</th>
                    <th className="border-b px-4 py-3 font-semibold">Service</th>
                    <th className="border-b px-4 py-3 font-semibold">Result</th>
                    <th className="border-b px-4 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="odd:bg-blue-50 even:bg-purple-50 hover:bg-blue-100/60 transition">
                      <td className="border-b px-4 py-2 text-center">
                        {item.service === 'face' ? (
                          <FacePreview
                            src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${item.file_path}`}
                            faces={item.result?.faces}
                          />
                        ) : (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${item.file_path}`}
                            alt="preview"
                            className="h-14 mx-auto rounded shadow"
                          />
                        )}
                      </td>
                      <td className="border-b px-4 py-2 font-medium text-blue-700">{item.service}</td>
                      <td className="border-b px-4 py-2">
                        {(() => {
                          if (item.service === 'deepfake') {
                            return item.result?.score > 0.5
                              ? <span className="text-red-600 font-bold">Likely Fake</span>
                              : <span className="text-green-600 font-bold">Likely Real</span>;
                          }
                          if (item.service === 'face') {
                            const count = item.result?.faces?.length ?? 0;
                            return count === 0 ? <span className="text-gray-500">No face</span> : <span className="text-blue-700 font-semibold">{count} face(s)</span>;
                          }
                          if (item.service === 'wad') {
                            const w = item.result || {};
                            return <span className="text-purple-700">Weapon {w.weapon ?? 0}, Alcohol {w.alcohol ?? 0}, Drugs {w.drugs ?? 0}</span>;
                          }
                          if (item.service === 'offensive') {
                            const off = item.result?.offensive?.prob ?? null;
                            return off === null ? '-' : <span className="text-red-700 font-semibold">{Math.round(off * 100)}% offensive</span>;
                          }
                          if (item.service === 'properties') {
                            return <span className="text-blue-700">{item.result?.width}x{item.result?.height}</span>;
                          }
                          if (item.service === 'celebrity') {
                            const names = item.result?.celebrities?.map((c) => c.name).join(', ');
                            return names ? <span className="text-purple-700 font-semibold">{names}</span> : <span className="text-gray-500">None</span>;
                          }
                          return '-';
                        })()}
                      </td>
                      <td className="border-b px-4 py-2 text-gray-600">{new Date(item.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
