# Dwaar Web Frontend

A production-quality React frontend for the Dwaar hyperlocal community platform.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running on http://localhost:5000 (or configured URL)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your backend URLs:
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

For production:
```
VITE_API_URL=https://dwaar-backend.onrender.com
VITE_SOCKET_URL=https://dwaar-backend.onrender.com
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Type Checking

Check TypeScript types:
```bash
npm run type-check
```

## Project Structure

```
src/
├── api/              # API layer and Axios configuration
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Input, etc.)
│   └── ...          # Feature components
├── context/         # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── socket/          # Socket.IO configuration
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Features

- **Authentication**: Login, signup, phone verification
- **Dashboard**: Overview of user's communities and activity
- **Discover**: Location-based discovery of nearby communities
- **Communities**: User groups and joined rooms
- **Group Chat**: Real-time group messaging
- **Private Messages**: Direct messaging with users
- **Profile**: User profile management
- **Settings**: Account and privacy settings
- **Responsive Design**: Mobile, tablet, and desktop layouts

## API Integration

The frontend consumes the existing Dwaar backend REST APIs and Socket.IO server:

- REST API: Base URL configured via `VITE_API_URL`
- Socket.IO: URL configured via `VITE_SOCKET_URL`
- Authentication: JWT tokens stored in localStorage
- Protected routes: Require valid authentication

## Environment Variables

- `VITE_API_URL`: Backend API base URL
- `VITE_SOCKET_URL`: Socket.IO server URL

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT