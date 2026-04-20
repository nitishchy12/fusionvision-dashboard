import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Tooltip,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const typeStyleMap = {
  OSINT: { color: "#16a34a" },
  HUMINT: { color: "#2563eb" },
  IMINT: { color: "#9333ea" },
};

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  return `${base}${imageUrl}`;
};

function MapView({ data }) {
  const center = useMemo(() => {
    if (!data.length) return [20.5937, 78.9629];
    return [data[0].lat, data[0].lng];
  }, [data]);

  return (
    <section className="panel map-panel">
      <div className="map-header">
        <h2>Fusion Terrain Map</h2>
      </div>

      {!data.length ? (
        <p className="empty-state">No data available. Upload records to visualize intelligence.</p>
      ) : null}

      <div className="map-wrap">
        <MapContainer center={center} zoom={4} className="map-view">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data.map((entry) => (
            <CircleMarker
              key={entry._id}
              center={[entry.lat, entry.lng]}
              pathOptions={typeStyleMap[entry.type] || typeStyleMap.OSINT}
              radius={8}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1} sticky>
                <article className="popup-card">
                  <p className="popup-line">
                    <strong>Location:</strong> {entry.locationName || "Unknown"}
                  </p>
                  <p className="popup-line">
                    <strong>Source:</strong> {entry.type}
                  </p>
                  <p className="popup-line">
                    <strong>Description:</strong> {entry.description}
                  </p>
                  <p className="popup-line">
                    <strong>Time:</strong> {new Date(entry.timestamp).toLocaleString()}
                  </p>
                  {entry.imageUrl ? (
                    <img src={getImageUrl(entry.imageUrl)} alt="IMINT preview" />
                  ) : null}
                </article>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
        <div className="map-legend-overlay">
          <h4>Legend</h4>
          <p className="osint">🟢 OSINT</p>
          <p className="humint">🔵 HUMINT</p>
          <p className="imint">🟣 IMINT</p>
        </div>
      </div>
    </section>
  );
}

export default MapView;
