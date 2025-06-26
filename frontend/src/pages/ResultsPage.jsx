import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Navbar from '../components/Navbar';
import FacePreview from '../components/FacePreview';

export default function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api
      .get('/analyses')
      .then((res) => setResults(res.data))
      .catch(() => toast.error('Failed to load results'));
  }, []);

  return (
    <div className="flex flex-col min-h-screen pt-14">
      <Navbar />
      <div className="p-4 flex-grow">
        <h2 className="text-xl mb-4">Analysis Results</h2>
        <table className="min-w-full text-sm border bg-white rounded shadow">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Preview</th>
              <th className="border px-2 py-1">Service</th>
              <th className="border px-2 py-1">Result</th>
              <th className="border px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id} className="odd:bg-gray-100">
                <td className="border px-2 py-1">{item.id}</td>
                <td className="border px-2 py-1 text-center">
                  {item.service === 'face' ? (
                    <FacePreview
                      src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${item.file_path}`}
                      faces={item.result?.faces}
                    />
                  ) : (
                    <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${item.file_path}`} alt="preview" className="h-12 mx-auto" />
                  )}
                </td>
                <td className="border px-2 py-1">{item.service}</td>
                <td className="border px-2 py-1">
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
                <td className="border px-2 py-1">
                  {new Date(item.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
