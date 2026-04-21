# Backend (Node + Express)

Setup:

```bash
cd backend
npm install
npm run start
# or for development with auto-reload:
# npm run dev
```

API:
- GET /api/hello -> { message: 'Hello from backend' }

MongoDB setup

1. Install MongoDB locally or use a hosted MongoDB Atlas cluster.
2. Copy `.env.example` to `.env` and set `MONGO_URI`.

Example `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/lingualink
PORT=8000
```

User API

- POST /api/users  -> create a user
	- body JSON: { name, email, password, bio, interests:[...], languagesKnown:[...], languagesLearning:[...], subscription }
- GET /api/users -> list users (passwords excluded)

Example create user (curl):

```bash
curl -X POST http://localhost:8000/api/users \
	-H "Content-Type: application/json" \
	-d '{"name":"Alice","email":"alice@example.com","password":"secret","bio":"Hi","interests":["music"],"languagesKnown":["English"],"languagesLearning":["Spanish"],"subscription":false}'
```

