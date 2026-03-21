# Vyntyra Internship Backend

This directory now hosts the MERN-style API that replaces the old PHP form handler.

## Setup
1. Run `npm install` to install dependencies.
2. Copy `.env.example` to `.env` and provide a valid `MONGODB_URI` (defaults to `mongodb://127.0.0.1:27017/vyntyra-internships`).
3. Adjust `UPLOAD_DIR` if you want resumes stored outside the default `uploads` directory.

## Running
- `npm run dev` (requires `nodemon`) while working locally.
- `npm start` for production.

## API
- `POST /api/applications` accepts `multipart/form-data` with the same fields as the original HTML form plus a `resume` file.
- The route validates all required fields, stores the resume under `uploads/`, and persists the payload to MongoDB.
- The response is JSON with a success message on a `201` status code.
