# Deepfake Detection MVP

This project contains a simple Laravel API backend and a React frontend using Vite. The backend integrates with [Sightengine](https://sightengine.com/) to perform deepfake analysis on uploaded files.

The free Sightengine tier allows **1000 requests per month**. Each additional call is charged according to their pricing (around $0.001 per request at the time of writing). This project stores a per-user API limit so you can restrict how many analyses each account can run.

## Getting Started with Git

Clone the repository and install the dependencies for both the backend and frontend:

```bash
git clone <repository-url>
cd Deepfake-detection
```

After cloning you can follow the setup instructions below for each part of the application.

## Prerequisites

- PHP ^8.2 with Composer
- Node.js >=18
- A MySQL database (or update `.env` with your preferred connection)
- Sightengine API credentials

## Backend Setup

1. `cd backend`
2. Run `composer install`
3. Copy `.env.example` to `.env` and fill in database details and Sightengine credentials. Set `FILESYSTEM_DISK=public` so uploaded files are accessible via the `/storage` URL.
4. Generate an application key:
   ```bash
   php artisan key:generate
   ```
5. Run migrations with seeders to populate dummy data:
   ```bash
   php artisan migrate --seed
   ```
6. Link the storage directory (for uploaded files):
   ```bash
   php artisan storage:link
   ```
7. Start the development server:
   ```bash
   php artisan serve
   ```
   The API will be available at `http://localhost:8000`.

## Frontend Setup

1. `cd frontend`
2. Run `npm install`
3. Copy `.env.example` to `.env` and ensure `VITE_API_BASE_URL` points to your Laravel server (default is `http://localhost:8000/api`)
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
5. Open the provided URL (usually `http://localhost:5173/landing.html`) to view the landing page. The React app is available under `/login` and other routes.

<<<<<<< HEAD
=======

>>>>>>> main
## Linting

Run ESLint on the frontend with:
```bash
npm run lint
```

## Notes

Backend tests and migrations may require additional setup if PHP is not installed locally. Sightengine API calls need valid credentials.
The database seeders create an admin account with email `admin@example.com` and password `password`. Access the admin dashboard at `http://localhost:8000/admin`.
From the Users page in the dashboard you can adjust the API request limit for each account.
