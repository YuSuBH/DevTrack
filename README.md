# DevTrack

A minimal, dark-themed issue tracker for engineering teams. Supports multiple projects, per-project issue management, and a live insights panel.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| MongoDB | ≥ 6 (local or Atlas) |

---

## Environment Setup

1. Copy the example env file:

```bash
cp server/.env.example server/.env
```

2. Open `server/.env` and set your connection string:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devtrack
```

For MongoDB Atlas replace the value with your Atlas connection URI.

---

## Running in Development

Both servers must run concurrently. Open two terminals.

**Server** (Express + Mongoose, port 5000):

```bash
cd server
npm install
npm run dev
```

**Client** (React + Vite, port 5173):

```bash
cd client
npm install
npm run dev
```

The Vite dev server proxies all `/api` requests to `http://localhost:5000`, so no CORS configuration is needed locally.

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Seeding the Database

Wipes all existing data and inserts 3 sample projects with 14 issues:

```bash
cd server
npm run seed
```

---

## Running Tests

> Phase 2 was replaced with manual API testing via `server/tests/api.http`. No automated test suite is configured.

To run manual tests, open `server/tests/api.http` in VS Code with the REST Client extension.

---

## Project Structure

```
devtrack/
├── client/                  # React + Vite + Tailwind frontend
│   └── src/
│       ├── api/             # Typed fetch wrappers
│       ├── components/      # UI components
│       │   └── ui/          # Reusable primitives (Badge, Spinner, Modal, FormField)
│       ├── context/         # ProjectContext, IssueContext
│       └── types/           # Shared TypeScript interfaces
└── server/                  # Express + Mongoose backend
    └── src/
        ├── controllers/     # Route handler logic
        ├── lib/             # MongoDB connection helper
        ├── middleware/       # Error handler, resolveProject
        ├── models/          # Mongoose schemas (Project, Issue)
        └── routes/          # Express routers
```

---

## API Reference

Base URL: `http://localhost:5000`

### Projects

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/projects` | List all projects |
| `POST` | `/api/projects` | Create a project |
| `GET` | `/api/projects/:projectId` | Get a project by ID |
| `PATCH` | `/api/projects/:projectId` | Update a project |
| `DELETE` | `/api/projects/:projectId` | Delete project + all its issues |

### Issues (scoped to a project)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/projects/:projectId/issues` | List issues (supports `?search`, `?status`, `?priority`) |
| `GET` | `/api/projects/:projectId/issues/stats` | Aggregated counts (total, open, inProgress, closed) |
| `GET` | `/api/projects/:projectId/issues/:id` | Get a single issue |
| `POST` | `/api/projects/:projectId/issues` | Create an issue |
| `PATCH` | `/api/projects/:projectId/issues/:id` | Partial update an issue |
| `DELETE` | `/api/projects/:projectId/issues/:id` | Delete an issue |

### Request / Response shapes

**Create / update issue body:**
```json
{
  "title": "string (required, 1–100 chars)",
  "description": "string (optional, max 500 chars)",
  "status": "Open | In Progress | Closed",
  "priority": "Low | Medium | High | Critical",
  "labels": ["string"]
}
```

**Error envelope:**
```json
{ "error": "Human-readable message", "details": { "field": "message" } }
```

---

## Acceptance Criteria

| ID | Criterion | Status |
|----|-----------|--------|
| AC-1 | Issue list renders title, status badge, priority badge, labels, ID, created and updated timestamps | ✅ |
| AC-2 | Creating an issue with a missing title returns 400 and shows field error | ✅ |
| AC-3 | Updating status to "Closed" reflects in list and stats without page reload | ✅ |
| AC-4 | Deleting an issue removes it from the list and updates stats | ✅ |
| AC-5 | Search debounced ≤ 400 ms, preserves active filters | ✅ |
| AC-6 | Status + priority filters combine correctly | ✅ |
| AC-7 | Dashboard stats always reflect whole dataset regardless of active filter | ✅ |
| AC-8 | Loading spinner shown while any fetch is in flight | ✅ |
| AC-9 | API unreachable → error message shown, no mock data | ✅ |
| AC-10 | Issues and projects persist in MongoDB across server restarts | ✅ |
| AC-11 | API tests — replaced with manual `api.http` test file | ➖ |
| AC-12 | README documents prerequisites, env, dev commands, API summary | ✅ |
