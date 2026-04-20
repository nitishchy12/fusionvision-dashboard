# FusionVision - Multi-Source Intelligence Dashboard

A full-stack geospatial dashboard that ingests multi-format intelligence data, classifies it into OSINT/HUMINT/IMINT, and visualizes it on an interactive map for rapid situational awareness.

## Why it matters

Analysts often work across fragmented tools (spreadsheets, database viewers, image galleries). FusionVision consolidates ingestion, storage, and geospatial visualization into one workflow to reduce context switching and speed up triage.

Applicable domains:

- Smart cities and civic monitoring
- Security and incident response operations
- Logistics and operations intelligence

## Key highlights

- Full-stack application: React (Vite) + Node.js (Express) + MongoDB
- Ingestion: JSON, CSV, Excel (XLS/XLSX), and image uploads (JPG/JPEG)
- Classification: OSINT, HUMINT, IMINT
- Geospatial visualization: Leaflet map with colored markers by type
- Interactive exploration: hover details, filtering, search, and demo seeding

## Architecture

```text
Frontend (React + Leaflet)
        |
Backend (Node.js + Express)
        |
MongoDB
```

## How it works

1. Upload a file (JSON/CSV/Excel/Image) or enter a manual report
2. Backend parses, validates, classifies, and stores the data in MongoDB
3. Frontend fetches data and renders markers on the map
4. Hover a marker to view details and image preview (IMINT)

## Data model (MongoDB)

```json
{
  "type": "OSINT | HUMINT | IMINT",
  "lat": "Number",
  "lng": "Number",
  "description": "String",
  "locationName": "String",
  "imageUrl": "String",
  "timestamp": "Date"
}
```

## API endpoints

- `POST /api/data/upload`
- `GET /api/data/all`
- `GET /api/data/type/:type`
- `GET /api/summary`
- `POST /api/data/demo-seed`

## Environment setup

### Backend (`backend/.env`)

```env
PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/fusionvision
CLIENT_URL=http://localhost:5173
UPLOAD_PATH=uploads/
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5002
```

## Run locally

### MongoDB

```bash
mongod
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Demo flow (recommended)

1. Click "Run Demo" to seed sample multi-source records
2. Filter markers by type (All / OSINT / HUMINT / IMINT)
3. Use search to narrow by location label or description
4. Upload an image with coordinates to create an IMINT marker
5. Hover markers to view details and image preview

## Design decisions

- MongoDB provides flexible storage for heterogeneous ingestion inputs
- Backend-side validation/classification keeps behavior consistent across clients
- Leaflet provides lightweight geospatial rendering for an interactive demo

## Edge cases handled

- Unsupported file types rejected
- Missing or invalid coordinates rejected
- Empty dataset states in UI
- Image preview served from backend uploads path

## Future improvements

- Real-time updates via WebSockets
- Authentication and role-based access control
- Advanced correlation and anomaly detection
- Deployment scripts for cloud hosting

## Project structure

```text
fusionvision-dashboard/
  backend/
  frontend/
```

## Author

Nitish Kumar Choudhary
