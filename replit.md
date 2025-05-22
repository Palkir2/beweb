# Application Portal - System Architecture Guide

## Overview

This application is an Application Portal system that allows users to submit applications and admins to review them. It consists of a React frontend with a Node.js/Express backend using Drizzle ORM for database operations. The system uses session-based authentication and has role-based access control with distinct user and admin experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with:
- **React**: For building the UI components
- **Tailwind CSS**: For styling
- **shadcn/ui**: For UI components (based on Radix UI)
- **Wouter**: For client-side routing
- **React Query (TanStack Query)**: For data fetching and state management
- **Zod**: For validation

The frontend follows a component-based architecture with separation of concerns:
- **Pages**: Container components for different routes
- **Components**: Reusable UI components
- **Hooks**: Custom hooks for shared logic
- **Lib**: Utility functions

### Backend Architecture

The backend uses:
- **Express.js**: For the API server
- **Drizzle ORM**: For database operations
- **Express Session**: For authentication
- **MemoryStore**: For storing sessions (would typically use a persistent store in production)
- **bcrypt**: For password hashing

The backend follows a modular design with:
- **Routes**: API endpoints
- **Storage**: Database access layer
- **Authentication**: Session management and access control

### Database Architecture

The database schema is defined using Drizzle ORM and includes:
- **Users**: For storing user accounts with roles (admin/user)
- **Applications**: For storing application submissions

### Authentication Flow

The system uses session-based authentication:
1. User logs in with username/password
2. Server validates credentials
3. Session is created with user information
4. Session ID is stored in a cookie
5. Session is checked on protected routes

## Key Components

### Frontend Components

1. **App.tsx**: Main component with routing logic
2. **Login.tsx**: Authentication page
3. **AdminDashboard.tsx**: Admin interface for reviewing applications
4. **ApplicationForm.tsx**: User interface for submitting applications
5. **UserLayout.tsx/AdminLayout.tsx**: Layout components with navigation
6. **UI Components**: Using shadcn/ui library for consistent design

### Backend Components

1. **index.ts**: Server entry point
2. **routes.ts**: API route definitions
3. **auth.ts**: Authentication middleware
4. **storage.ts**: Database interface
5. **schema.ts**: Database schema definitions

### Shared Components

1. **schema.ts**: Shared database types and validation schemas

## Data Flow

### Authentication Flow
1. User submits login credentials
2. Server validates credentials against stored user data
3. If valid, a session is created and user info is stored in the session
4. Frontend stores session in a cookie and uses it for subsequent requests

### Application Submission Flow
1. User fills out application form
2. Form is validated client-side
3. Form is submitted to the server
4. Server validates the request
5. Application is stored in the database
6. Response is sent to the client

### Admin Review Flow
1. Admin views list of submitted applications
2. Admin can approve or reject applications
3. Status update is sent to the server
4. Database is updated with new application status

## External Dependencies

### Frontend Dependencies
- React for UI rendering
- TanStack Query for data fetching
- Shadcn/UI (built on Radix UI) for component library
- Tailwind CSS for styling
- Wouter for routing
- Zod for validation

### Backend Dependencies
- Express for API server
- Drizzle ORM for database operations
- bcrypt for password hashing
- Express Session for authentication

### Development Dependencies
- Vite for frontend bundling
- TypeScript for type safety
- ESBuild for backend bundling

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**:
   - Frontend: Vite builds static assets
   - Backend: ESBuild bundles server code

2. **Runtime Environment**:
   - Node.js 20
   - PostgreSQL 16

3. **Environment Configuration**:
   - DATABASE_URL: Connection string for PostgreSQL
   - SESSION_SECRET: Secret for session encryption
   - NODE_ENV: Development/production environment

4. **Start Command**:
   - Development: `npm run dev`
   - Production: `npm run start`

5. **Port Configuration**:
   - Local port: 5000
   - External port: 80

The development workflow starts both the frontend Vite dev server and the backend Express server simultaneously, with the backend proxying frontend requests when needed.