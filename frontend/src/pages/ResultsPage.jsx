import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api
      .get('/analyses')
      .then((res) => setResults(res.data))
      .catch(() => toast.error('Failed to load results'));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="p-4 flex-grow">
        <h2 className="text-xl mb-4">Analysis Results</h2>
        <table className="min-w-full text-sm border">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">File</th>
              <th className="border px-2 py-1">Score</th>
              <th className="border px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id} className="odd:bg-gray-100">
                <td className="border px-2 py-1">{item.id}</td>
                <td className="border px-2 py-1">{item.file_path}</td>
                <td className="border px-2 py-1">
                  {item.result?.score !== undefined ? item.result.score : '-'}
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
