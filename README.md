# Digital Memories Now

Digital Memories Now is a web application that allows you to create and manage digital photo albums. It provides an intuitive interface for uploading, organizing, and viewing your precious memories.

## Features

- Create beautiful digital photo albums
- Upload and manage photos with drag-and-drop
- Browse your albums in a responsive gallery
- View albums in a sleek carousel interface
- MongoDB backend for data persistence
- ImageKit.io integration for efficient image storage and delivery

## Tech Stack

### Frontend
- Vite
- TypeScript
- React
- React Router
- shadcn-ui components
- Tailwind CSS
- TanStack React Query

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- ImageKit.io SDK
- Multer for file uploads

## Project Structure

The project is organized as follows:

- `src/` - Frontend React application
  - `components/` - Reusable UI components
  - `lib/` - Utility functions and services
  - `pages/` - Page components
  - `types/` - TypeScript type definitions
  - `hooks/` - Custom React hooks
- `backend/` - Express server backend
  - `src/` - Backend source code
    - `controllers/` - API endpoint controllers
    - `models/` - MongoDB data models
    - `routes/` - API route definitions
    - `config/` - Configuration files
    - `middleware/` - Express middleware

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or remote)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see backend/README.md for details)

# Start development server
npm run dev
```

## ImageKit.io Integration

This project uses ImageKit.io for image storage and optimization. The configuration and credentials are:

- ImageKitID: arjunb
- URL-endpoint: https://ik.imagekit.io/arjunb
- Public Key: public_Ma/GzYXuWrzkHPH1rdSLqvo9b/M=

See the backend README for more details on setting up ImageKit.io.

## API Documentation

See `backend/README.md` for detailed API documentation.

## Environment Variables

For production deployment on Vercel, set the following environment variables in the Vercel project settings:

```
# API URL - set to your Render backend URL with /api path
VITE_API_URL=https://digital-memories-b.onrender.com/api

# ImageKit.io credentials
VITE_IMAGEKIT_PUBLIC_KEY=your_public_key_here
VITE_IMAGEKIT_URL_ENDPOINT=your_url_endpoint_here
```

**Important:** For Vercel deployment with Render backend:
1. Make sure your Render backend has CORS properly configured 
2. Set `FRONTEND_URL=https://digital-memories.vercel.app` in your Render environment variables
3. Vercel's environment variables need to be added in the project settings dashboard

## Troubleshooting CORS Issues

If you experience CORS issues with your deployed application:

1. **Check Backend Environment Variables**:
   - Ensure `FRONTEND_URL` is set exactly to `https://digital-memories.vercel.app` on Render

2. **Check Frontend Environment Variables**:
   - Ensure `VITE_API_URL` is set exactly to `https://digital-memories-b.onrender.com/api` on Vercel

3. **Test CORS Configuration**:
   Visit the following test endpoints to diagnose CORS issues:
   - `https://digital-memories-b.onrender.com/api/test/cors-test`
   - `https://digital-memories-b.onrender.com/api/test/echo`
   - `https://digital-memories-b.onrender.com/api/health`

4. **Browser Extensions**:
   - Temporarily disable any browser extensions that might interfere with CORS
   - Try using a different browser or incognito mode

5. **Render Settings**:
   - Check Render's outbound rules in the web service settings
   - Make sure automatic TLS/SSL is enabled

6. **Clear Browser Cache**:
   - Clear your browser cache and cookies before testing again

## License

This project is licensed under the MIT License - see the LICENSE file for details.
