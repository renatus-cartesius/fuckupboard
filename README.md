# Fuck up board

A simple board for sharing IT fuckups and learning from others' mistakes.

## Features

- List of entries (fuckup stories)
- Ranking by likes
- Add new fuckup stories
- Like existing fuckups
- Minimalistic React frontend

## Backend (Golang)

### API Endpoints

- `GET /list` - Get all fuckups ordered by likes
- `POST /add` - Add new fuckup (requires user and desc in JSON body)
- `PUT /like?id={id}` - Like a fuckup by ID

### Running the Backend

```bash
# Option 1: Direct command
go run main.go

# Option 2: Using the script
./back.sh
```

The server will start on `http://localhost:8080`

## Frontend (React)

A minimalistic React frontend with TypeScript.

### Features

- View all fuckups in a clean, card-based layout
- Add new fuckup stories through a simple form
- Like fuckups with a single click
- Responsive design for mobile and desktop
- Error handling and loading states

### Running the Frontend

```bash
# Option 1: Direct commands
cd frontend
npm install
npm start

# Option 2: Using the script
./front.sh
```

The frontend will be available at `http://localhost:3000`

### Building for Production

```bash
cd frontend
npm run build
```

## Quick Start Scripts

### Individual Services
- `./back.sh` - Start only the Golang backend
- `./front.sh` - Start only the React frontend

### Both Services Together
- `./start.sh` - Start both backend and frontend simultaneously

## Project Structure

```
fckupboard/
├── main.go              # Golang backend server
├── fuckups.db           # SQLite database
├── go.mod               # Go dependencies
├── go.sum               # Go dependencies checksum
├── back.sh              # Backend startup script
├── front.sh             # Frontend startup script
├── start.sh             # Combined startup script
├── README.md            # This file
└── frontend/            # React frontend
    ├── src/
    │   ├── components/  # React components
    │   ├── services/    # API service functions
    │   ├── types/       # TypeScript type definitions
    │   └── App.tsx      # Main application
    ├── package.json     # Node.js dependencies
    └── README.md        # Frontend documentation
```
