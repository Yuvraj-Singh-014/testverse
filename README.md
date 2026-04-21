# HackuVerse — Certificate Download Platform

A full-stack web application for generating and downloading personalized certificates.
Built with React, Node.js serverless functions, ExcelJS, and PDFKit. Deployable on Vercel.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Frontend    | React 18, React Router, react-hot-toast |
| API         | Vercel Serverless Functions (Node.js)   |
| Excel       | ExcelJS                                 |
| PDF         | PDFKit                                  |
| Styling     | Custom CSS (green + black theme)        |

---

## Project Structure

```
├── api/                        # Vercel serverless functions
│   ├── certificate/
│   │   └── verify.js           # POST — verify & generate certificate
│   ├── admin/
│   │   ├── participants.js     # GET  — list participants
│   │   ├── history.js          # GET  — download history
│   │   └── upload.js           # POST — (disabled on serverless)
│   ├── health.js               # GET  — health check
│   └── package.json
├── data/                       # Static data files (committed to repo)
│   ├── participants.xlsx       # Participant records
│   └── certificate_template.png  # Certificate background (add your own)
├── frontend/                   # React app
│   └── src/
│       ├── components/         # Navbar, Footer
│       ├── pages/              # Home, About, Events, Download, Admin
│       └── styles/
├── backend/                    # Local dev Express server (not used on Vercel)
├── vercel.json                 # Vercel deployment config
└── package.json                # Workspace root
```

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Vercel auto-detects the config from `vercel.json`
4. Click **Deploy**

That's it. No environment variables required for basic deployment.

### Optional Environment Variable

| Variable       | Description                        | Default |
|----------------|------------------------------------|---------|
| `FRONTEND_URL` | Allowed CORS origin for API calls  | `*`     |

---

## Updating Participants

Since Vercel is serverless, file uploads can't persist between requests.
To update the participant list:

1. Edit `data/participants.xlsx`
2. Commit and push to GitHub
3. Vercel redeploys automatically

### Excel Format

| Column        | Required | Notes                       |
|---------------|----------|-----------------------------|
| Name          | ✅ Yes   | Used for exact match lookup |
| Email         | ✅ Yes   | Case-insensitive match      |
| CertificateID | Optional | Auto-generated if missing   |

---

## Certificate Template

Place your certificate background at:
```
data/certificate_template.png
```

- Recommended size: **1754 × 1240 px** (A4 landscape at 150 DPI)
- The participant's name is overlaid centered at ~56.5% from the top
- If no template is found, a styled dark certificate is generated automatically

---

## Local Development

```bash
# Install all dependencies
npm install --legacy-peer-deps

# Start both backend and frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Test Credentials

| Name            | Email                |
|-----------------|----------------------|
| Alice Johnson   | alice@example.com    |
| Bob Smith       | bob@example.com      |
| Carol Williams  | carol@example.com    |
| David Brown     | david@example.com    |
| Eva Martinez    | eva@example.com      |

---

## API Endpoints

| Method | Endpoint                    | Description                   |
|--------|-----------------------------|-------------------------------|
| POST   | `/api/certificate/verify`   | Verify & download certificate |
| GET    | `/api/admin/participants`   | List all participants         |
| GET    | `/api/admin/history`        | Download history              |
| GET    | `/api/health`               | Health check                  |
