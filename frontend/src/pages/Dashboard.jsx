import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { Link } from "react-router-dom";
import FacePreview from "../components/FacePreview";
import Dropzone from "../components/Dropzone";
import { useAuthContext } from '../context/AuthContext';

import { Button } from "../components/ui/Button";
import  Navbar from  "../components/Navbar"; // Import the Navbar component
import "../Dashboard.css"; // import the CSS you created above

export default function Dashboard() {
    const { isAuthenticated, logout } = useAuthContext();
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [service, setService] = useState("deepfake");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");

  useEffect(() => {
    api
      .get("/analyses")
      .then((res) => setResults(res.data))
      .catch(() => toast.error("Failed to load results"));
  }, []);

  const filtered = results
    .filter((r) => r.service.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "created_at"
        ? new Date(b.created_at) - new Date(a.created_at)
        : a.service.localeCompare(b.service)
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to analyze");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("service", service);
    try {
      setLoading(true);
      setProgress(25);
      const { data } = await api.post("/detect", formData);
      setProgress(100);
      toast.success("File analyzed");
      setResults((prev) => [data, ...prev]);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <span className="nav-brand">DEEPFAKE DETECTOR</span>
        <div className="nav-links">
          <Link to="/#features">Features</Link>
          <Link to="/#contact">Contact</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
           <button onClick={logout}>
                Logout
              </button>
          
        </div>
      </nav>
      {/* Main */}
      <main className="dashboard-main">
        {/* File Analysis Card */}
        <div className="dashboard-card">
          <h2>Analyze New File</h2>
          <form onSubmit={handleSubmit} className="dashboard-form">
            <Dropzone
              onFile={(f) => {
                setFile(f);
                setPreview(URL.createObjectURL(f));
              }}
              preview={preview}
            />
            <select
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
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
            {progress > 0 && (
              <progress value={progress} max="100" style={{ width: "100%" }} />
            )}
          </form>
        </div>

        {/* Search/Sort Bar */}
        <div className="dashboard-search-bar">
          <input
            placeholder="Search by service"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="created_at">Newest</option>
            <option value="service">Service</option>
          </select>
        </div>

        {/* Results Table */}
        <div className="dashboard-results-card">
          <h3>Recent Results</h3>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", color: "#bbb", padding: "48px 0" }}>
              <div style={{ fontSize: "2rem" }}>📄</div>
              No analyses yet. Upload a file!
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Service</th>
                  <th>Result</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.service === "face" ? (
                        <FacePreview
                          src={`${import.meta.env.VITE_API_BASE_URL.replace(
                            "/api",
                            ""
                          )}/storage/${item.file_path}`}
                          faces={item.result?.faces}
                        />
                      ) : (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL.replace(
                            "/api",
                            ""
                          )}/storage/${item.file_path}`}
                          alt="preview"
                        />
                      )}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>{item.service}</td>
                    <td>
                      {(() => {
                        if (item.service === "deepfake") {
                          // Support both item.result.score and item.result.deepfake (number or object)
                          const score =
                          typeof item.result?.score === "number"
                            ? item.result.score
                            : typeof item.result?.deepfake === "number"
                            ? item.result.deepfake
                            : typeof item.result?.type?.deepfake === "number"
                            ? item.result.type.deepfake
                            : null;
                          if (score === null) return "-";
                          return score > 0.5
                          ? <span style={{ fontWeight: 700, textDecoration: "underline" }}>Likely Fake</span>
                          : <span style={{ fontWeight: 700, textDecoration: "underline" }}>Likely Real</span>;
                        }
                        if (item.service === "face") {
                          const count
                           = item.result?.faces?.length ?? 0;
                          return count === 0 ? (
                            <span>No face</span>
                          ) : (
                            <span>{count} face(s)</span>
                          );
                        }
                        if (item.service === "wad") {
                          const w = item.result || {};
                          return (
                            <span>
                              Weapon: {w.weapon ?? 0}, Alcohol: {w.alcohol ?? 0}, Drugs: {w.drugs ?? 0}
                            </span>
                          );
                        }
                        if (item.service === "offensive") {
                          const off = item.result?.offensive?.prob ?? null;
                          return off === null ? "-" : `${Math.round(off * 100)}% offensive`;
                        }
                        if (item.service === "properties") {
                          return `${item.result?.width ?? ''}x${item.result?.height ?? ''}`;
                        }
                        if (item.service === "celebrity") {
                          const names = item.result?.celebrities?.map((c) => c.name).join(", ");
                          return names || "None";
                        }
                        return "-";
                      })()}
                    </td>
                    <td>
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
