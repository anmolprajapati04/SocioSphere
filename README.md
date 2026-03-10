# SocioSphere – Smart Society Management System

SocioSphere is a full-stack smart society management system with a Node.js/Express backend and a React (Vite) frontend.

## Tech Stack

- **Backend**: Node.js, Express, Sequelize, MySQL, Socket.IO, Nodemailer, JWT
- **Frontend**: React (Vite), React Router, Axios
- **Styling**: Plain CSS (`main.css`, `dashboard.css`, `forms.css`)

## Backend Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create and configure MySQL database:

- Create a database named `sociosphere_db`.
- Ensure the user configured in `.env` has access.

3. Environment variables (`backend/.env`):

```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sociosphere_db
JWT_SECRET=supersecretkey
```

4. Run the backend:

```bash
cd backend
npx nodemon src/server.js
```

The backend will be available on `http://localhost:5000`.

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Run the frontend:

```bash
cd frontend
npm run dev
```

The app will be available on the URL printed by Vite (typically `http://localhost:5173`).

## Features

- **Authentication**
  - User registration and login
  - JWT-based auth with refresh tokens
  - Role-based access control (SUPER_ADMIN, SOCIETY_ADMIN, RESIDENT, SECURITY_GUARD, ACCOUNTANT)

- **Core Modules**
  - Users and roles
  - Maintenance plans and payments
  - Complaints and visitor management
  - Amenities and amenity bookings
  - Notices, notifications, and audit logs (schema ready)

- **Real-time**
  - Socket.IO events:
    - `visitor_request`
    - `visitor_approved`
    - `complaint_update`
    - `emergency_alert`

- **Email**
  - Nodemailer helpers for:
    - Maintenance bill notification
    - Payment receipt
    - Visitor approval request
    - Password reset

- **Dashboards**
  - Admin: residents count, maintenance revenue, complaints, visitor analytics, defaulters.
  - Resident: payments, complaints, visitors, amenity bookings, notices.
  - Security: visitor entry/exit logging and resident search.

## Scripts

- **Backend**: `npm run dev` (from `backend/`) – runs `nodemon src/server.js`.
- **Frontend**: `npm run dev` (from `frontend/`) – runs Vite dev server.

