# College Notice Board System

A full-stack MERN application for managing college announcements, exams, holidays, and events.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios, Lucide React, React Hot Toast
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Project Structure

```
college notice board/
├── client/          # React frontend (Vite)
├── server/          # Express backend
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

1. Navigate to server folder and install dependencies:

   ```bash
   cd server
   npm install
   ```

2. Copy `.env.example` to `.env` (or create `.env`) and set:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/college-notice-board
   JWT_SECRET=your-secret-key
   ```

3. (Optional) Seed an admin user:

   ```bash
   npm run seed:admin
   ```

   Default admin: `admin@college.edu` / `admin123`

4. Start the server:

   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to client folder and install dependencies:

   ```bash
   cd client
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:5173

## Features

- **Public Home Page**: Masonry-style notice grid with search and category filters
- **Authentication**: Register and Login with validation
- **Admin Dashboard**: Post new notices, view and delete existing ones (admin role only)
- **Categories**: Exam, Holiday, Event
- **Responsive UI**: Academic color palette (navy, royal blue, greys)

## API Endpoints

| Method | Endpoint                 | Auth   | Description          |
|--------|--------------------------|--------|----------------------|
| POST   | /api/auth/register       | No     | Register new user    |
| POST   | /api/auth/login          | No     | Login                |
| GET    | /api/auth/me             | Yes    | Get current user     |
| GET    | /api/notices             | No     | List notices (search, filter) |
| POST   | /api/notices             | Admin  | Create notice        |
| DELETE | /api/notices/:id         | Admin  | Delete notice        |
