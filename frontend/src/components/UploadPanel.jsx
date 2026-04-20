import { useState } from "react";
import { uploadIntelData } from "../services/api";

function UploadPanel({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    description: "",
    locationName: "",
    lat: "",
    lng: "",
    type: "HUMINT",
    timestamp: "",
  });
  const [status, setStatus] = useState({ kind: "", message: "" });
  const [isUploading, setIsUploading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ kind: "", message: "" });

    if (!file && (!form.description || !form.lat || !form.lng)) {
      setStatus({
        kind: "error",
        message: "Provide either a file or manual HUMINT fields (description, lat, lng).",
      });
      return;
    }

    try {
      setIsUploading(true);
      const payload = new FormData();

      if (file) payload.append("file", file);
      if (form.description) payload.append("description", form.description);
      if (form.locationName) payload.append("locationName", form.locationName);
      if (form.lat) payload.append("lat", form.lat);
      if (form.lng) payload.append("lng", form.lng);
      if (form.type) payload.append("type", form.type);
      if (form.timestamp) payload.append("timestamp", form.timestamp);

      const result = await uploadIntelData(payload);
      setStatus({
        kind: "success",
        message: `Upload successful (${result.count} record${result.count > 1 ? "s" : ""}).`,
      });
      setFile(null);
      setForm({
        description: "",
        locationName: "",
        lat: "",
        lng: "",
        type: "HUMINT",
        timestamp: "",
      });
      onUploadSuccess();
    } catch (error) {
      const message = error.response?.data?.message || "Upload failed. Please try again.";
      setStatus({ kind: "error", message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Data Ingestion</h2>
      <p className="helper">Upload JSON/CSV/Excel/Image or enter manual HUMINT input.</p>

      <form onSubmit={handleSubmit} className="upload-form">
        <label>
          File (JSON, CSV, XLSX, JPG, JPEG)
          <input
            type="file"
            accept=".json,.csv,.xlsx,.xls,.jpg,.jpeg,image/jpeg,image/jpg"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </label>

        <label>
          Location Label
          <input
            name="locationName"
            value={form.locationName}
            onChange={onChange}
            placeholder="Sector 18"
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Suspicious activity near sector alpha."
            rows={3}
          />
        </label>

        <div className="grid-2">
          <label>
            Latitude
            <input
              name="lat"
              type="number"
              step="any"
              value={form.lat}
              onChange={onChange}
              placeholder="28.6139"
            />
          </label>
          <label>
            Longitude
            <input
              name="lng"
              type="number"
              step="any"
              value={form.lng}
              onChange={onChange}
              placeholder="77.2090"
            />
          </label>
        </div>

        <div className="grid-2">
          <label>
            Type
            <select name="type" value={form.type} onChange={onChange}>
              <option value="HUMINT">HUMINT</option>
              <option value="OSINT">OSINT</option>
              <option value="IMINT">IMINT</option>
            </select>
          </label>
          <label>
            Timestamp
            <input
              name="timestamp"
              type="datetime-local"
              value={form.timestamp}
              onChange={onChange}
            />
          </label>
        </div>

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Intelligence"}
        </button>

        {status.message ? (
          <p className={status.kind === "error" ? "status error" : "status success"}>
            {status.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}

export default UploadPanel;
