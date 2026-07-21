import { useState, useEffect } from 'react';
import './App.css';

interface Universidad {
  name: string;
  country: string;
  domains: string[];
  web_pages: string[];
}

function App() {
  const [universidades, setUniversidades] = useState<Universidad[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('Peru');

  const consultarAPI = async (pais: string) => {
    if (!pais.trim()) {
      setUniversidades([]);
      return;
    }

    setCargando(true);
    setError('');

    try {
      const response = await fetch(`/search?country=${pais}`);
      if (!response.ok) throw new Error('Error en la consulta');
      
      const data: Universidad[] = await response.json();
      setUniversidades(data);
    } catch {
      setError('No se pudo obtener las universidades. Intenta de nuevo.');
      setUniversidades([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    consultarAPI(busqueda);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      consultarAPI(busqueda);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">Universidades</h1>
          <p className="subtitle">Busca universidades por país</p>
        </div>
      </header>

      <div className="container">
        <div className="search-section">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Busca un país..."
              value={busqueda}
              onChange={handleBuscar}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button onClick={() => consultarAPI(busqueda)} className="search-btn">
              Buscar
            </button>
          </div>
        </div>

        {cargando && <div className="loading">Cargando universidades...</div>}

        {error && !cargando && <div className="error">{error}</div>}

        {universidades.length > 0 && !cargando && (
          <div>
            <div className="result-info">
              <p className="result-count">Se encontraron <strong>{universidades.length}</strong> universidades</p>
            </div>
            <div className="universidades-grid">
              {universidades.map((uni) => (
                <div key={`${uni.name}-${uni.domains[0] || uni.country}`} className="universidad-card">
                  <h4>{uni.name}</h4>
                  <p><strong>País:</strong> {uni.country}</p>
                  <p><strong>Dominio:</strong> <code>{uni.domains[0] || 'N/A'}</code></p>
                  {uni.web_pages[0] && (
                    <a href={uni.web_pages[0]} target="_blank" rel="noopener noreferrer" className="link">
                      Visitar sitio →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!cargando && universidades.length === 0 && !error && (
          <div className="no-results">Ingresa un país para buscar universidades</div>
        )}
      </div>
    </div>
  );
}

export default App;
