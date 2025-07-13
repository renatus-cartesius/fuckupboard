# Fuckup Board Frontend

A minimalistic React frontend for the Fuckup Board application.

## Features

- View all fuckups ordered by likes
- Add new fuckup stories
- Like existing fuckups
- Responsive design
- Error handling and loading states

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- The Golang backend running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

## API Integration

The frontend communicates with the Golang backend through the following endpoints:

- `GET /list` - Fetch all fuckups
- `POST /add` - Add a new fuckup
- `PUT /like?id={id}` - Like a fuckup

## Project Structure

```
src/
├── components/
│   ├── FuckupCard.tsx      # Individual fuckup display
│   ├── FuckupCard.css
│   ├── AddFuckupForm.tsx   # Form to add new fuckups
│   └── AddFuckupForm.css
├── services/
│   └── api.ts             # API service functions
├── types/
│   └── Fuckup.ts          # TypeScript type definitions
├── App.tsx                # Main application component
└── App.css               # Main application styles
```

## Technologies Used

- React 18
- TypeScript
- Axios for API calls
- CSS3 for styling
