import { useEffect, useState } from "react";
import DashboardStats from "./components/DashboardStats";
import MapView from "./components/MapView";
import UploadPanel from "./components/UploadPanel";
import { fetchAllIntel, fetchSummary, seedDemoData } from "./services/api";
import "./App.css";

const initialSummary = {
  total: 0,
  byType: {
    OSINT: 0,
    HUMINT: 0,
    IMINT: 0,
  },
};

function App() {
  const [intelData, setIntelData] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionStatus, setActionStatus] = useState("");

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError("");
      const [allData, summaryData] = await Promise.all([fetchAllIntel(), fetchSummary()]);
      setIntelData(allData);
      setSummary(summaryData);
    } catch (requestError) {
      setError("Unable to load dashboard data. Check backend and database connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredData = intelData.filter((entry) => {
    const typeMatches = activeFilter === "ALL" ? true : entry.type === activeFilter;
    const search = searchTerm.trim().toLowerCase();
    if (!search) return typeMatches;

    const haystack = [
      entry.locationName,
      entry.description,
      entry.type,
      String(entry.lat),
      String(entry.lng),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return typeMatches && haystack.includes(search);
  });

  const filteredSummary = filteredData.reduce(
    (acc, item) => {
      acc.total += 1;
      acc.byType[item.type] += 1;
      return acc;
    },
    {
      total: 0,
      byType: { OSINT: 0, HUMINT: 0, IMINT: 0 },
    },
  );

  const handleRunDemo = async () => {
    try {
      setIsDemoLoading(true);
      setActionStatus("");
      await seedDemoData();
      await loadDashboard();
      setActionStatus("Demo dataset inserted. Multi-source map refreshed.");
    } catch (demoError) {
      setActionStatus("Demo seed failed. Please verify backend and MongoDB.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>FusionVision AI</h1>
        <p>Multi-Source Intelligence Fusion Dashboard</p>
      </header>

      <section className="toolbar panel">
        <div className="filter-group">
          {["ALL", "OSINT", "HUMINT", "IMINT"].map((type) => (
            <button
              key={type}
              className={activeFilter === type ? "active" : ""}
              onClick={() => setActiveFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          placeholder="Search location, description, source..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button className="demo-btn" onClick={handleRunDemo} disabled={isDemoLoading}>
          {isDemoLoading ? "Running..." : "Run Demo"}
        </button>
      </section>

      <DashboardStats summary={filteredSummary} activeFilter={activeFilter} />

      <section className="layout-grid">
        <UploadPanel onUploadSuccess={loadDashboard} />
        <MapView data={filteredData} />
      </section>

      {isLoading ? <p className="status">Loading intelligence feed...</p> : null}
      {error ? <p className="status error">{error}</p> : null}
      {!isLoading && !error && !actionStatus ? (
        <p className="status">Database total: {summary.total}</p>
      ) : null}
      {actionStatus ? <p className="status success">{actionStatus}</p> : null}
    </main>
  );
}

export default App;
