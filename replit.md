# Overview

This is a full-stack web application built with Express.js backend and Vue.js frontend. The application provides a RESTful API for user management with in-memory data storage, complete with Swagger documentation for API exploration. The frontend demonstrates API consumption through a clean, interactive interface that allows users to view and create user records.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Vue.js 3 (CDN-based, no build process)
- **Structure**: Single-page application with component-based architecture
- **Styling**: Custom CSS with responsive design
- **API Communication**: Native Fetch API for HTTP requests
- **File Organization**: Static files served from `/public` directory

## Backend Architecture
- **Framework**: Express.js 5 with RESTful API design
- **Server Structure**: Modular routing with separate route handlers
- **Middleware Stack**: CORS, JSON parsing, and static file serving
- **API Documentation**: Swagger/OpenAPI 3.0 with automated UI generation
- **Data Storage**: In-memory arrays (temporary storage for demonstration)

## Route Organization
- **Main Server**: `/api/server.js` - Core server configuration and middleware
- **User Routes**: `/api/user/index.js` - User management endpoints
- **Static Assets**: Served from `/public` directory
- **Documentation**: Swagger UI available at `/docs` endpoint

## API Design Patterns
- **RESTful Endpoints**: Standard HTTP methods (GET, POST) for resource operations
- **JSON Communication**: Request/response bodies in JSON format
- **Error Handling**: Basic error responses with appropriate HTTP status codes
- **Documentation**: JSDoc comments for automatic Swagger generation

## Development Approach
- **No Build Process**: Direct file serving for rapid development
- **Hot Reloading**: Manual refresh required (no automated bundling)
- **Modular Structure**: Separate concerns between routes, static files, and configuration

# External Dependencies

## NPM Packages
- **express**: Web framework for Node.js backend
- **cors**: Cross-origin resource sharing middleware
- **swagger-jsdoc**: Swagger specification generation from JSDoc comments
- **swagger-ui-express**: Swagger UI interface for API documentation
- **vue**: Frontend JavaScript framework (loaded via CDN)
- **@types/node**: TypeScript definitions for Node.js

## CDN Dependencies
- **Vue.js 3**: Loaded from unpkg CDN for frontend framework

## Development Tools
- **Swagger UI**: Interactive API documentation and testing interface
- **Static File Serving**: Express built-in static middleware for frontend assets

Note: The application currently uses in-memory storage for demonstration purposes. A persistent database solution would be needed for production use.