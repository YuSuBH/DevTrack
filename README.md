# DevTrack

A minimal, dark-themed issue tracker built for engineering teams. DevTrack lets you manage multiple projects, triage issues by status and priority, and stay oriented with a live insights panel — all from a single-page interface.

---

## Features

- **Multi-project support** — create, switch between, and manage independent projects from a persistent sidebar
- **Full issue lifecycle** — create, edit, and delete issues with title, description, status, priority, and free-form labels
- **Real-time filtering** — debounced search, status tabs, and priority filter with server-side query execution
- **Dashboard stats** — per-project issue counts (total, open, in progress, closed) always reflecting the full dataset
- **Insights panel** — status breakdown with progress bars, priority distribution, and recent activity feed
- **Issue traceability** — each issue displays a short ID, opened date, and last-updated timestamp

---

## Technologies Used

**Client**
- React 19 + TypeScript
- Vite
- Tailwind CSS

**Server**
- Node.js + Express 5
- TypeScript + tsx
- Mongoose + MongoDB

---

## Setup and Installation

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| MongoDB | ≥ 6 (local or Atlas) |

### 1. Clone the repository

```bash
git clone <repo-url>
cd devtrack
```

### 2. Install dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devtrack
```

Replace `MONGO_URI` with your Atlas connection string if using MongoDB Atlas.

### 4. Seed the database (optional)

Inserts 3 sample projects and 14 issues:

```bash
cd server && npm run seed
```

---

## Running the Application

Open two terminals from the project root.

**Terminal 1 — Server:**

```bash
cd server
npm run dev
```

Runs on `http://localhost:5000`

**Terminal 2 — Client:**

```bash
cd client
npm run dev
```

Runs on `http://localhost:5173`. The Vite dev server proxies all `/api` requests to the server, so no CORS setup is needed.

---

## API Reference

Base URL: `http://localhost:5000`

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List all projects |
| `POST` | `/api/projects` | Create a project |
| `GET` | `/api/projects/:id` | Get a project by ID |
| `PATCH` | `/api/projects/:id` | Update a project |
| `DELETE` | `/api/projects/:id` | Delete project and all its issues |

### Issues

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects/:id/issues` | List issues (`?search`, `?status`, `?priority`) |
| `GET` | `/api/projects/:id/issues/stats` | Aggregated counts |
| `GET` | `/api/projects/:id/issues/:issueId` | Get a single issue |
| `POST` | `/api/projects/:id/issues` | Create an issue |
| `PATCH` | `/api/projects/:id/issues/:issueId` | Partial update |
| `DELETE` | `/api/projects/:id/issues/:issueId` | Delete an issue |

---

## AI Tool Used

This project was built using **Kiro** 

### AI Development Experience

Kiro was used throughout the entire development cycle, acting as a collaborative engineering partner rather than just a code generator. Development was structured around a spec document (requirements, data models, API contracts, acceptance criteria, and a phased task list) that Kiro helped produce and then systematically worked through.

The workflow was conversational: design decisions were discussed first, then Kiro implemented them, type-checked and built the output before presenting results, and picked up again after a session crash by reading the spec artifact and the current codebase state.

### Specific Tasks Where Kiro Was Used

1. **API design and server implementation** — Kiro designed the full REST API including nested resource routing (`/api/projects/:id/issues`), the `resolveProject` middleware pattern, cascade-delete behaviour, and all Mongoose schema validation rules. It then implemented every controller, route, and error handler.

2. **Multi-project refactor** — When multi-project support was added, Kiro planned the schema change (adding a `project` ref to `Issue`), updated every query to scope by `projectId`, introduced a new `ProjectContext`, re-threaded the `IssueContext` to accept a `projectId` prop, and rewrote the seed script — coordinating across 10+ files in one session.

3. **UI component system** — Kiro built the full component tree from scratch: reusable primitives (`Badge`, `Spinner`, `Modal`, `FormField`), shared form components (`IssueForm`, `ProjectForm`) used by both create and edit modals, and the insights panel with live status bars and relative timestamps.

4. **Debugging and iterative refinement** — Several UI issues were fixed through conversation: the sidebar scrolling with the page (fixed with `position: fixed` + `ml-52` offset), redundant stat badges in the header, coloured top borders on cards, and the issue card layout being too flat (refactored to a taller three-row design with ID, title, and badges on separate rows).
