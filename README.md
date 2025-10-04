# Service Marketplace Monorepo

A monorepo containing:

- **frontend/** – Next.js application (React UI)
- **backend/** – Express + Mongoose API server

## Tech Stack

| Area     | Stack                                                             |
| -------- | ----------------------------------------------------------------- |
| Frontend | Next.js, React, Tailwind CSS (planned)                            |
| Backend  | Node.js, Express, Mongoose, JWT, bcryptjs (choose one bcrypt lib) |
| Testing  | Jest, Testing Library (frontend), Supertest (backend planned)     |
| Tooling  | npm workspaces, Concurrently                                      |

## Workspace Structure

```
root
├─ package.json (workspaces, shared scripts)
├─ frontend/
└─ backend/
```

## Scripts (Root)

| Script                 | Purpose                                               |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Run backend and frontend together                     |
| `npm run dev:frontend` | Frontend only dev server                              |
| `npm run dev:backend`  | Backend only (nodemon)                                |
| `npm run lint`         | Run lint in all workspaces (after backend lint added) |
| `npm run test`         | Run tests in all workspaces                           |
| `npm run build`        | Build the frontend                                    |

## Initial Setup

```bash
npm install
```

## Running Development

```bash
npm run dev
```

Then visit: http://localhost:3000 (frontend). Backend default: http://localhost:3001 (if you set that port in code).

## Adding Backend Linting (Planned)

Will add ESLint config to backend so root `npm run lint` covers both projects.

## Testing Roadmap

- Frontend: already has Jest config.
- Backend: will add Jest + Supertest to test routes (e.g. auth endpoints).

## Formatting (Planned)

Prettier config to ensure consistent style.

## Commit Quality

Using Conventional Commits (e.g. `feat:`, `fix:`, `chore:`) is recommended.

## Environment Variables

Create a `.env` in backend for database connection and JWT secret.
Example:

```
MONGODB_URI=mongodb://localhost:27017/servicemarketplace
JWT_SECRET=change_me
PORT=3001
```

(Do not commit real secrets.)

## Future Enhancements

- CI workflow (GitHub Actions) for lint + test.
- Docker setup for backend + Mongo.
- Shared TypeScript types package if needed.

## License

Add a license if you plan to open source.
