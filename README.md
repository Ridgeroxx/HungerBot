# FoodBot

A simple full-stack food ordering demo with:

- `backend/`: FastAPI service providing a menu API
- `frontend/`: Vite + React UI with framer-motion interactions
- `docker-compose.yml`: optional local setup for service orchestration

## Backend

1. Open `backend/`
2. Create a virtual environment
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Start the backend:
   ```bash
   bash backend/start.sh
   ```

The API will run on `http://localhost:8000/menu`.

## Frontend

1. Open `frontend/`
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`.

## Docker Compose

If you want to run both services together, use:

```bash
docker-compose up --build
```

## Notes

- The backend seeds sample menu data on startup.
- The frontend fetches menu items from `http://localhost:8000/menu`.
- `tailwind.config.js` is included for optional extension, but styles are implemented with plain CSS.
