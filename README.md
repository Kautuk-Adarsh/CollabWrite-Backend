# CollabWrite — Backend

REST API server for CollabWrite, a collaborative document editor supporting concurrent users, version history, and role-based access control.


---

## Tech Stack

- **Runtime:** Node.js & Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT with HTTP-only cookies
- **Editor Integration:** Tiptap (via frontend)

---

## Architecture

Client (Next.js + Tiptap)
│
|
Express Server (App.js)
│
┌────┴────┐
│         │
Routes   Middleware
│     (JWT Auth)
|
Controllers
│
|
MongoDB (Models)

---

## Project Structure

CollabWrite-Backend/
├── Controllers/      # Business logic for documents, users, versions
├── Middleware/       # JWT verification, role-based access guards
├── Models/           # Mongoose schemas (User, Document, Version)
├── Routes/           # Express route definitions (10+ endpoints)
├── config/           # Environment and DB configuration
├── App.js            # Express app setup and middleware registration
├── Server.js         # Entry point
└── db.js             # MongoDB connection

---

## Key Features

- **Collaborative Editing** — Document state managed via REST with Tiptap on the frontend for rich-text editing
- **Version History & Rollback** — Every save creates a versioned snapshot; any prior version is restorable
- **Role-Based Access Control** — Middleware enforces owner/editor/viewer permissions per document
- **JWT Authentication** — Stateless auth via signed tokens stored in HTTP-only cookies, preventing XSS token theft
- **10+ REST Endpoints** — Fully documented with expected inputs, outputs, and edge case behavior

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT cookie |
| `POST` | `/api/auth/logout` | Clear auth cookie |
| `GET` | `/api/documents` | Fetch all documents for authenticated user |
| `POST` | `/api/documents` | Create a new document |
| `GET` | `/api/documents/:id` | Fetch a single document |
| `PUT` | `/api/documents/:id` | Update document content (creates version snapshot) |
| `DELETE` | `/api/documents/:id` | Delete document (owner only) |
| `GET` | `/api/documents/:id/versions` | Fetch version history |
| `POST` | `/:id/versions/:versionId/restore` | Rollback to a specific version |

---

## Setup

**Prerequisites:** Node.js v18+, MongoDB URI

```bash
git clone https://github.com/Kautuk-Adarsh/CollabWrite-Backend.git
cd CollabWrite-Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Run the server:

```bash
node Server.js
```
