# 🚀 FusionVision AI

> A full-stack geospatial intelligence system for multi-source data fusion and real-time visualization.

FusionVision AI is a production-style intelligence dashboard that ingests heterogeneous data sources (JSON, CSV, Images), classifies them into structured intelligence categories, and visualizes them on an interactive geospatial map for real-time situational awareness.

---

## 🌍 Why This Matters

Modern intelligence systems often suffer from fragmented data sources and lack of unified visualization.

FusionVision AI solves this by:
- Aggregating multi-source data into a single system
- Providing real-time geospatial insights
- Enabling faster and more informed decision-making

This makes it relevant for:
- Smart cities
- Security monitoring systems
- Logistics and operations intelligence

---

## ✨ Key Highlights

- End-to-end full-stack system (React + Node.js + MongoDB)
- Multi-format ingestion (JSON, CSV, XLS, Images)
- Real-time geospatial visualization using Leaflet
- Intelligent classification (OSINT, HUMINT, IMINT)
- Interactive UI with hover-based insights
- Modular backend architecture with clean APIs
- Demo simulation for quick testing

---

## 🏗️ Architecture

```text
Frontend (React + Leaflet)
        ↓
Backend (Node.js + Express)
        ↓
MongoDB (Database)
```

## 🔄 How It Works

1. User uploads data (JSON, CSV, Image, or manual input)
2. Backend parses and validates the input
3. Data is classified into:
   - OSINT (structured data)
   - HUMINT (manual input)
   - IMINT (image-based)
4. Data is stored in MongoDB
5. Frontend fetches and displays data on map
6. Hover interaction reveals detailed intelligence insights

## 🗄️ Database Schema

```json
{
  "type": "OSINT | HUMINT | IMINT",
  "lat": "Number",
  "lng": "Number",
  "description": "String",
  "imageUrl": "String",
  "timestamp": "Date"
}
```

## 🧪 API Endpoints

- `POST /api/data/upload` -> Upload multi-source data
- `GET /api/data/all` -> Retrieve all intelligence data
- `GET /api/data/type/:type` -> Filter by intelligence type
- `GET /api/summary` -> Dashboard statistics
- `POST /api/data/demo-seed` -> Generate sample demo data

## 🎨 Features

### 📍 Geospatial Dashboard

- Interactive Leaflet map
- Color-coded markers:
  - 🟢 OSINT
  - 🔵 HUMINT
  - 🟣 IMINT

### 🧠 Intelligence Visualization

- Hover popups with:
  - Description
  - Source type
  - Timestamp
  - Image preview (for IMINT)

### 📤 Data Ingestion

- Upload:
  - JSON
  - CSV / Excel
  - Images
  - Manual data entry

### 📊 Dashboard Insights

- Total records
- Count by intelligence type
- Real-time updates

### 🎯 Interaction

- Filter by type (OSINT / HUMINT / IMINT)
- Search functionality
- Demo seed for quick testing

## ⚙️ Environment Setup

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

## ▶️ Run Locally

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

### MongoDB

```bash
mongod
```

## 🎬 Demo Flow

1. Upload JSON -> markers appear on map
2. Upload image -> IMINT (purple) marker appears
3. Hover marker -> view details + image preview
4. Use filters to explore data types
5. Observe dashboard updates in real-time

## ⚠️ Design Decisions

- Used MongoDB for flexible schema (supports varied data types)
- Used Leaflet for lightweight geospatial rendering
- Implemented classification logic at backend for consistency
- Added demo seed API for easy testing without external data

## 🛡️ Edge Cases Handled

- Invalid file uploads
- Missing latitude/longitude
- Empty datasets
- Backend/DB unavailability fallback
- Image preview safety handling

## 🚀 Future Improvements

- Real-time streaming using WebSockets
- Advanced ML-based classification
- Role-based access control
- Scalable cloud deployment (AWS/GCP)

## 📂 Project Structure

```text
fusionvision-ai/
 ├── frontend/   → React UI
 ├── backend/    → API server
```

## 👨‍💻 Author

Nitish Kumar Choudhary
# FusionVision AI

Multi-Source Intelligence Fusion Dashboard built with React, Node.js, Express, and MongoDB.

## Final Project Structure

```text
fusionvision-ai/
│
├── backend/
│   ├── src/
│   ├── uploads/                (auto-created, ignored)
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Backend `.env`

Create `backend/.env`:

```env
PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/fusionvision
CLIENT_URL=http://localhost:5173
UPLOAD_PATH=uploads/
NODE_ENV=development
```

`backend/.env.example` has the same values.

## Frontend `.env`

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5002
```

`frontend/.env.example` has the same value.

## Database Schema

```json
{
  "type": "OSINT | HUMINT | IMINT",
  "lat": 0,
  "lng": 0,
  "description": "string",
  "imageUrl": "string",
  "timestamp": "date"
}
```

## Backend APIs

- `POST /api/data/upload`
- `GET /api/data/all`
- `GET /api/data/type/:type`
- `GET /api/summary`
- `POST /api/data/demo-seed`

## Frontend Features

- Leaflet map with colored markers:
  - OSINT: green
  - HUMINT: blue
  - IMINT: purple
- Hover popup with description, type, timestamp, and image preview
- Upload panel for JSON/CSV/Image
- Dashboard summary (total and per type)
- Filter buttons and search
- Demo seed button

## How To Run

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

### MongoDB

```bash
mongod
```

## Demo Flow

1. Upload JSON -> markers appear
2. Upload image -> IMINT (purple) marker appears
3. Hover marker -> details + image preview
4. Check dashboard updates
5. Filter by type
