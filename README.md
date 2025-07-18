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
- `DELETE /unlike?id={id}` - Unlike a fuckup by ID

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
- Like and unlike fuckups with a single click
- Persistent like state across browser sessions
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

## Database Setup

### Run Migrations
```bash
# Option 1: Using the migration script (recommended)
./migrate.sh

# Option 2: Using the initialization script
./init-db.sh

# Option 3: Using SQLite3 directly
sqlite3 fuckups.db < migrations/20240101000000_create_fuckups_table.sql
sqlite3 fuckups.db < migrations/20240101000001_add_likes_index.sql

# Option 4: Check migration status
./migrate.sh fuckups.db status
```

## Docker Development

### Using Docker Compose
```bash
# Initialize database first (if not exists)
docker-compose --profile init up db-init

# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## Production Deployment

The application includes a complete CI/CD pipeline using GitHub Actions and Ansible.

### Quick Start
1. Set up GitHub repository secrets (see `DEPLOYMENT.md`)
2. Push to main branch to trigger automatic deployment
3. Access your application at `http://your-server-ip`

### Manual Deployment
```bash
cd ansible
ansible-playbook deploy.yml
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Project Structure

```
fckupboard/
├── main.go                    # Golang backend server
├── fuckups.db                 # SQLite database
├── go.mod                     # Go dependencies
├── go.sum                     # Go dependencies checksum
├── Dockerfile.backend         # Backend Docker image
├── docker-compose.yml         # Local development setup
├── migrate.sh                 # Database migration script
├── init-db.sh                 # Database initialization script
├── back.sh                    # Backend startup script
├── front.sh                   # Frontend startup script
├── start.sh                   # Combined startup script
├── README.md                  # This file
├── DEPLOYMENT.md              # Deployment documentation
├── migrations/                # Database migrations
│   ├── 20240101000000_create_fuckups_table.sql
│   └── 20240101000001_add_likes_index.sql
├── cmd/migrate/               # Migration tool
│   └── main.go               # Goose migration runner
├── .github/workflows/         # GitHub Actions CI/CD
│   └── deploy.yml
├── ansible/                   # Ansible deployment
│   ├── deploy.yml            # Main deployment playbook
│   ├── rollback.yml          # Rollback playbook
│   ├── inventory.yml         # Server inventory
│   ├── requirements.yml      # Ansible collections
│   └── ansible.cfg           # Ansible configuration
└── frontend/                  # React frontend
    ├── src/
    │   ├── components/       # React components
    │   ├── services/         # API service functions
    │   ├── types/            # TypeScript type definitions
    │   └── App.tsx           # Main application
    ├── Dockerfile            # Frontend Docker image
    ├── package.json          # Node.js dependencies
    └── README.md             # Frontend documentation
```
