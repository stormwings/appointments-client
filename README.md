# Appointments Client

Medical appointments management system following the FHIR R4 Appointments specification. Frontend built with Next.js 16 that connects to a NestJS backend API.

## Technologies

- **Next.js 16.0.3** with App Router
- **React 19.2**
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** with PostCSS
- **Server Components** by default

## Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm or bun
- Backend API running on `http://localhost:8000` (configurable)
- Docker Desktop (for containerized deployment)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd appointments-client

# Install dependencies
npm install

# Configure environment variables (optional)
cp .env.example .env.local
```

## Configuration

Create a `.env.local` file at the project root to override default settings:

```bash
# Backend API URL (used by Next.js API routes for proxying)
# Local development: http://localhost:8000
# Docker: http://host.docker.internal:8000
BACKEND_API_URL=http://localhost:8000
```

## Usage

### Development (Local)

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: Make sure the backend API is running on `http://localhost:8000` before starting the frontend.

### Production (Local)

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

## Docker Deployment

### Prerequisites

**IMPORTANT**: Before using Docker, ensure Docker Desktop is installed and running:

1. **Download Docker Desktop**: https://www.docker.com/products/docker-desktop/
2. **Install and start Docker Desktop**
3. **Verify installation**:
   ```bash
   docker --version
   docker-compose --version
   ```

### Quick Start with Docker

The easiest way to run the application with Docker:

```bash
# Make sure your backend is running on localhost:8000
# Then start the frontend container
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### Docker Compose Commands

```bash
# Start in detached mode (background)
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f frontend
```

### Development with Docker (Hot Reload)

For development with hot reload enabled:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Or in detached mode
docker-compose -f docker-compose.dev.yml up -d
```

This setup:
- Runs frontend on `http://localhost:3000` with hot reload
- Connects to backend on `http://localhost:8000` (must be running on host)
- Mounts source code for live updates

### Manual Docker Build

Build and run the Docker image manually:

```bash
# Build the image
docker build -t appointments-client .

# Run the container
docker run -p 3000:3000 \
  -e BACKEND_API_URL=http://host.docker.internal:8000 \
  --add-host host.docker.internal:host-gateway \
  appointments-client
```

### Docker Configuration

The application uses the following Docker configuration:

- **Production**: `Dockerfile` (multi-stage build with Next.js standalone output)
- **Development**: `Dockerfile.dev` (hot reload enabled)
- **Orchestration**: `docker-compose.yml` (production), `docker-compose.dev.yml` (development)

**Important**: The container uses `host.docker.internal:8000` to connect to the backend running on your host machine.

## Project Structure

```
appointments-client/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page (appointments list)
│   ├── appointments/
│   │   ├── new/page.tsx          # New appointment form
│   │   └── [id]/page.tsx         # Appointment detail
│   ├── api/                      # API routes (proxy to backend)
│   │   └── appointments/         # Appointments endpoints
│   ├── layout.tsx                # Root layout
│   ├── error.tsx                 # Error handling
│   └── not-found.tsx             # 404 page
├── components/                   # React Components (Client Components)
│   ├── AppointmentCard.tsx       # Appointment card
│   ├── AppointmentForm.tsx       # Appointment form
│   ├── FilterBar.tsx             # Status filters
│   ├── Pagination.tsx            # Pagination
│   ├── StatusActions.tsx         # Status change actions
│   └── StatusBadge.tsx           # Status badge
├── lib/                          # Business logic
│   ├── appointments.ts           # Types and functions
│   └── api.ts                    # API client
├── Dockerfile                    # Production Docker image
├── Dockerfile.dev                # Development Docker image
├── docker-compose.yml            # Production orchestration
├── docker-compose.dev.yml        # Development orchestration
├── .dockerignore                 # Docker build exclusions
├── API.md                        # Backend API documentation
├── CLAUDE.md                     # Claude Code instructions
└── README.md                     # This file
```

## Features

### Appointment Management

- **List appointments**: View all appointments with pagination
- **Filter by status**: Filter appointments by status (booked, fulfilled, cancelled, etc.)
- **Create appointment**: Form to schedule new appointments
- **View details**: Detailed view of each appointment
- **Change status**: Valid transitions according to business rules
- **Cancel appointment**: Cancellation with comment

### Appointment States

According to FHIR R4 Appointments:

- `proposed`: Proposed
- `pending`: Pending
- `booked`: Booked
- `arrived`: Arrived
- `fulfilled`: Fulfilled
- `cancelled`: Cancelled
- `noshow`: No Show
- `entered-in-error`: Entered in Error
- `checked-in`: Checked In
- `waitlist`: Waitlist

### Transition Rules

State transitions follow strict rules defined in `lib/appointments.ts`. Terminal states (`fulfilled`, `cancelled`, `noshow`, `entered-in-error`) cannot transition to other states.

## Development

### Server Components vs Client Components

- **Server Components** (default): Used for data fetching
- **Client Components** (`'use client'`): Used for interactivity (events, hooks, browser APIs)

### State Management

This project uses **URL-based state management** via Next.js search params:

- `?status=booked` - Filter by status
- `?page=2` - Pagination

State changes trigger router navigation, which re-fetches data server-side.

### Path Aliases

Configured in `tsconfig.json`:

```typescript
import { appointmentsApi } from '@/lib/api';
```

The `@/` prefix maps to the project root.

## Backend API

See [API.md](./API.md) for complete backend API documentation.

Main endpoints:
- `GET /appointments` - List with pagination
- `GET /appointments/:id` - Get single appointment
- `POST /appointments` - Create appointment
- `PATCH /appointments/:id/status` - Update status
- `DELETE /appointments/:id` - Cancel appointment

## Troubleshooting

### Docker Issues

**Error: "The system cannot find the file specified"**
- Docker Desktop is not running
- Solution: Open Docker Desktop and wait for it to start completely

**Error: "docker: command not found"**
- Docker is not installed or not in PATH
- Solution: Reinstall Docker Desktop or restart your terminal

**Error: "ECONNREFUSED" when connecting to backend**
- Backend is not running on the host machine
- Solution: Start your backend on `localhost:8000` before running the frontend container

**Error: "version is obsolete"**
- Using old Docker Compose format
- Solution: Already fixed in current files (no `version:` field)

### Build Issues

**Error: "useSearchParams should be wrapped in suspense boundary"**
- Already fixed in the current version
- Solution: Components using `useSearchParams` are wrapped in `<Suspense>` boundaries

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues or questions, please open an issue in the repository.
