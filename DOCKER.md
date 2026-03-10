# Docker Build Instructions

## Local Development

For local development, use `.env.local`:

```bash
npm install
npm run dev
```

The app will connect to API at: `http://localhost:7049`

## Building Docker Image for Production

### Option 1: Using docker build command

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://161.97.112.112:5000 \
  -t tnt-travel-frontend:latest .
```

### Option 2: Using docker-compose

Update the `docker-compose.yml` file with your production API URL, then:

```bash
docker-compose build
docker-compose up -d
```

## Running the Container

```bash
docker run -d -p 80:80 tnt-travel-frontend:latest
```

The app will be available at: `http://localhost`

## Environment Variables

- `VITE_API_BASE_URL`: Backend API URL (required)
- `VITE_APP_NAME`: Application name (optional, defaults to "TNT Travel")

## Important Notes

- Environment variables must be set at **build time** for Vite apps
- Update `.env.production` before building for production
- Never commit `.env.local` or `.env.production` to git
