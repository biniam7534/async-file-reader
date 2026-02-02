import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Database, Layers, RefreshCw, BarChart3 } from 'lucide-react';
import './App.css'; // We'll keep index.css as the main global styles

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/files');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Could not connect to the backend server. Make sure it is running on port 5000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>AsyncFile<span style={{ color: '#f472b6' }}>Reader</span></h1>
        <p className="subtitle">Exploration of Asynchronous File Processing in a MERN Stack Environment</p>
      </header>

      {loading && <div className="loading-spinner"></div>}

      {error && (
        <div className="card" style={{ borderColor: '#ef4444', textAlign: 'center' }}>
          <p style={{ color: '#ef4444' }}>{error}</p>
          <button className="btn-refresh" onClick={fetchData} style={{ marginTop: '1rem' }}>
            <RefreshCw size={20} /> Retry
          </button>
        </div>
      )}

      {data && !loading && (
        <>
          <div className="stats-grid">
            {data.fileContents.map((file, index) => (
              <div key={file.name} className="card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-header">
                  <div className="icon-wrapper">
                    <FileText size={20} />
                  </div>
                  <h3 className="card-title">{file.name}</h3>
                </div>
                <div className="file-content">
                  {file.content}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' }}>
                  Size: {file.content.length} chars
                </div>
              </div>
            ))}

            <div className="card total-size-card" style={{ animationDelay: '0.4s' }}>
              <div>
                <div className="card-header">
                  <div className="icon-wrapper" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="card-title">Aggregated Statistics</h3>
                </div>
                <p style={{ color: '#94a3b8' }}>Total character count across all files processed asynchronously.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="total-value">{data.totalChars}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total Characters</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn-refresh" onClick={fetchData}>
              <RefreshCw size={20} /> Refresh Data
            </button>
          </div>
        </>
      )}

      <footer style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>
        <p>Built with MongoDB • Express • React • Node.js</p>
      </footer>
    </div>
  );
}

export default App;
