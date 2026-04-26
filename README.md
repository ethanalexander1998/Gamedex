# Gamedex

A MEAN stack web app for tracking your video game backlog. Like a Pokédex, but for games.

## Team

| Name | Role |
|------|------|
| Joseph Mun | Backend Development |
| Spencer Henderson | Frontend/UI Development |
| Gideon Masters | Database Development |
| Ethan Alexander | Deployment & Presentation |

## Features

- **Backlog Management** — Add, edit, and delete games from your library
- **Status Tracking** — Mark games as Plan to Play, Playing, Completed, or Dropped
- **Precision Rating** — Score games from 0.0 to 10.0
- **RAWG Integration** — Search the RAWG game database to auto-fill game details and cover art
- **Filtering & Sorting** — Filter by status, sort by date, score, or title
- **Pokédex-themed UI** — Pixel font, red Pokédex header, type-style status badges

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 19 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| External API | RAWG.io |

## Project Structure

```
FinalProject/
├── backend/
│   ├── models/Game.js       # Mongoose schema
│   ├── routes/games.js      # CRUD API routes
│   ├── routes/search.js     # RAWG proxy route
│   ├── server.js            # Express app
│   └── seed.js              # Database seeder
└── frontend/
    └── src/app/
        ├── services/        # GameService (HTTP)
        └── components/
            ├── dashboard/   # Game library grid
            ├── game-detail/ # Single game view
            └── game-form/   # Add/edit form
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | Get all games (supports `?status=` and `?search=`) |
| GET | `/api/games/:id` | Get one game |
| POST | `/api/games` | Create a game |
| PUT | `/api/games/:id` | Update a game |
| DELETE | `/api/games/:id` | Delete a game |
| GET | `/api/search?q=` | Search RAWG game database |

## Setup & Running

### Prerequisites

- Node.js
- MongoDB (running locally)
- Angular CLI (`npm install -g @angular/cli`)

### 1. Clone the repo

```bash
git clone git@github.com:jmun1209/Gamedex.git
cd Gamedex
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
MONGO_URI=mongodb://localhost:27017/gamedex
PORT=3000
RAWG_API_KEY=your_rawg_api_key_here
```

Get a free RAWG API key at [rawg.io/apidocs](https://rawg.io/apidocs).

Start the backend:

```bash
npm run dev
```

Seed sample data (optional):

```bash
npm run seed
```

### 3. Frontend

```bash
cd frontend
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200).
