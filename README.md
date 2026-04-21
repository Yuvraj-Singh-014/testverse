# HackuVerse — Certificate Download Platform

A full-stack web application for generating and downloading personalized certificates.
Built with React, Node.js/Express, ExcelJS, and PDFKit.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, React Router, react-hot-toast |
| Backend     | Node.js, Express                  |
| Excel       | ExcelJS                           |
| PDF         | PDFKit (pure JS, no native deps)  |
| Styling     | Custom CSS (green + black theme)  |

---

## Project Structure

```
├── backend/
│   ├── assets/              # Optional: certificate_template.png
│   ├── scripts/
│   │   └── createSampleData.js   # Generates sample participants.xlsx
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic (Excel, PDF, history)
│   │   └── index.js         # Express app entry point
│   ├── uploads/             # Uploaded Excel + download history JSON
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/      # Navbar, Footer
│       ├── pages/           # Home, About, Events, Download, Admin
│       ├── styles/          # global.css
│       └── App.js
└── README.md
```

---

## Quick Start

### 1. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Generate sample data

```bash
cd backend
node scripts/createSampleData.js
```

This creates `backend/uploads/participants.xlsx` with 8 sample participants.

### 3. Start the backend

```bash
cd backend
npm run dev        # development (nodemon)
# or
npm start          # production
```

Backend runs on **http://localhost:5000**

### 4. Start the frontend

```bash
cd frontend
npm start
```

Frontend runs on **http://localhost:3000**

---

## Pages

| Route       | Description                              |
|-------------|------------------------------------------|
| `/`         | Home — hero, features, CTA              |
| `/about`    | About Us — mission, values, team        |
| `/events`   | Events — filterable event cards         |
| `/download` | Download Certificate — main form        |
| `/admin`    | Admin Panel — upload Excel, view data   |

---

## Testing Certificate Download

Use these credentials from the sample data:

| Name            | Email                  |
|-----------------|------------------------|
| Alice Johnson   | alice@example.com      |
| Bob Smith       | bob@example.com        |
| Carol Williams  | carol@example.com      |
| David Brown     | david@example.com      |
| Eva Martinez    | eva@example.com        |

---

## Custom Certificate Template

To use your own certificate design:

1. Create a PNG image (recommended: 1754×1240 px, landscape)
2. Place it at `backend/assets/certificate_template.png`
3. The participant's name will be overlaid at the vertical center

If no template is found, a styled certificate is generated automatically.

---

## Admin Panel

Visit `/admin` to:
- **Upload** a new participants Excel file (drag & drop)
- **View** all participants loaded from the file
- **Monitor** certificate download history

### Excel Format

| Column        | Required | Notes                        |
|---------------|----------|------------------------------|
| Name          | ✅ Yes   | Exact match used for lookup  |
| Email         | ✅ Yes   | Case-insensitive match       |
| CertificateID | Optional | Auto-generated if missing    |

---

## API Endpoints

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/api/certificate/verify`   | Verify & download certificate  |
| POST   | `/api/admin/upload`         | Upload participants Excel file |
| GET    | `/api/admin/participants`   | List all participants          |
| GET    | `/api/admin/history`        | Get download history           |
| GET    | `/api/health`               | Health check                   |

---

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
```
