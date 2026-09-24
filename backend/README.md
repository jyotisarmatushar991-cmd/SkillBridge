# backend
Backend API and services for SkillBridge, supporting role-based access, user management, skill mapping, internships, placements, and academia–industry collaboration.

## Run
```bash
cp .env.example .env   # set JWT_SECRET
npm install
npm run dev            # or: npm start
```
Runs on http://localhost:5000 (Socket.IO on the same port).

## API
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | /api/auth/login | – | `{email,password,role}` → `{user,token}` |
| GET | /api/auth/me | token | current user |
| GET | /api/notices | – | newest first |
| POST | /api/notices | token | `{title,content}`; broadcasts `NOTICES_UPDATE` |
| GET | /api/users | moderator | |
| DELETE | /api/users/:id | moderator | returns `{users}` |

Socket.IO event `NOTICES_UPDATE` carries the full notice array (sent on connect and after every post).

Demo logins are in `data/store.js` (e.g. `aditi.student@skillbridge.dev` / `student123`). Change them before any real deployment.
