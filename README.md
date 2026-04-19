# Secure Notes

A full stack notes app built as a learning project for backend development. Features user authentication, encrypted passwords, JWT-protected routes, and persistent storage — all built from scratch.

## Tech Stack

**Backend**
- [Fastify](https://fastify.dev/) + TypeScript
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — SQLite database
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) — password hashing
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — JWT authentication
- [@fastify/cors](https://github.com/fastify/fastify-cors) — CORS support
- [@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit) — rate limiting

**Frontend**
- Vanilla HTML, CSS, JavaScript
- No frameworks

## Features

- User signup and login
- Passwords hashed with bcrypt (never stored in plain text)
- JWT tokens issued on login, stored in localStorage
- Protected routes — notes are only accessible with a valid token
- Full CRUD on notes: create, read, update, delete
- Notes are scoped per user — users can only access their own notes
- Rate limiting on all routes (20 requests/minute)
- Persistent storage via SQLite

## Project Structure

```
secure-notes/
├── backend/
│   ├── src/
│   │   ├── server.ts           # Entry point
│   │   ├── db.ts               # SQLite setup
│   │   ├── middleware/
│   │   │   └── authenticate.ts # JWT middleware
│   │   └── routes/
│   │       ├── auth.ts         # /signup, /login
│   │       ├── notes.ts        # /notes CRUD
│   │       └── debug.ts        # /userlist, /protected
│   ├── .env                    # Environment variables (not committed)
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── database/
    └── users.db                # SQLite database file
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repo
```bash
git clone https://github.com/yourusername/secure-notes.git
cd secure-notes
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Create a `.env` file in the `backend/` folder
```
JWT_SECRET=your-secret-key-here
```

4. Start the backend
```bash
npm run dev
```

5. Open `frontend/index.html` with the Live Server extension in VS Code

The backend runs on `http://localhost:3000` and the frontend on `http://127.0.0.1:5500`.

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/signup` | No | Create a new account |
| POST | `/login` | No | Login and receive a JWT token |
| POST | `/notes` | Yes | Create a new note |
| GET | `/getnotes` | Yes | Get all notes for the logged-in user |
| PATCH | `/notes/:id` | Yes | Update a note |
| DELETE | `/notes/:id` | Yes | Delete a note |

Protected routes require an `Authorization: Bearer <token>` header.

## Security

- Passwords are hashed with bcrypt (salt rounds: 10) and never stored in plain text
- JWTs are signed with a secret key stored in environment variables
- All note operations verify ownership server-side — users cannot access or modify each other's notes
- Rate limiting prevents brute force attacks
- The `.env` file and `database/` folder are excluded from version control

## What I Learned

- Setting up a Fastify + TypeScript backend from scratch
- HTTP request/response cycle and REST API design
- Password hashing with bcrypt
- JWT authentication and protected routes
- SQLite database with better-sqlite3
- Separating routes into modular files using Fastify plugins
- Environment variables and secrets management
- CORS and how browsers enforce cross-origin policy
- Connecting a vanilla JS frontend to a backend API
- localStorage for persistent client-side sessions