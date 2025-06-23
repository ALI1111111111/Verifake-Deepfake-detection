import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/analyses`).then((res) => {
      setResults(res.data);
    });
  }, []);

  return (
    <div className="p-4">
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
            <tr key={item.id}>
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
  );
}
