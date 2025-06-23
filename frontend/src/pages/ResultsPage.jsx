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
      <ul className="space-y-2">
        {results.map((item) => (
          <li key={item.id} className="border p-2">
            <pre className="text-sm">{JSON.stringify(item.result, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
