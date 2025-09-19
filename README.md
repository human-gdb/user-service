# User Service - Full-Stack Web Application

A full-stack web application built with Express.js backend and Vue.js frontend, featuring a RESTful API for user management with Swagger documentation and an interactive frontend interface.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or build and start production server
npm run build
npm start
```

The application will be available at:
- **Frontend**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger

## 📋 Available NPM Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all project dependencies |
| `npm run build` | Build both backend and frontend |
| `npm run build:backend` | Compile TypeScript backend to JavaScript |
| `npm run build:frontend` | Compile TypeScript frontend to JavaScript |
| `npm start` | Start production server (requires build first) |
| `npm run dev` | Start development server with hot reload |
| `npm test` | Run tests (currently not implemented) |

### Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Start development server (recommended for development)
npm run dev

# 3. For production deployment
npm run build
npm start
```

## 🏗️ Application Structure

```
user-service/
├── 📁 api/                    # Backend API routes
│   ├── 📁 user/              # User-related routes
│   │   └── user.ts           # User CRUD operations
│   └── types.ts              # TypeScript type definitions
├── 📁 dist/                  # Compiled JavaScript (generated)
│   ├── 📁 api/               # Compiled backend code
│   │   ├── 📁 api/           # Compiled API routes
│   │   ├── 📁 user/          # Compiled user routes
│   │   └── server.js         # Compiled server file
│   └── 📁 frontend/          # Compiled frontend code
│       └── app.js            # Compiled Vue.js application
├── 📁 frontend/              # Frontend source code
│   ├── app.ts                # Vue.js TypeScript application
│   └── tsconfig.json         # Frontend TypeScript config
├── 📁 public/                # Static assets (served by Express)
│   ├── index.html            # Main HTML template
│   └── 📁 css/               # Stylesheets
│       └── style.css         # Main styles
├── 📁 node_modules/          # Dependencies (generated)
├── server.ts                 # Main server file (consolidated)
├── tsconfig.json             # Backend TypeScript config
├── package.json              # Project configuration
└── README.md                 # This file
```

## 🔧 Architecture Overview

### Backend (Express.js)
- **Framework**: Express.js 5 with TypeScript
- **API**: RESTful endpoints for user management
- **Documentation**: Swagger/OpenAPI 3.0 with interactive UI
- **Middleware**: CORS, JSON parsing, static file serving
- **Data Storage**: In-memory arrays (demo purposes)

### Frontend (Vue.js)
- **Framework**: Vue.js 3 (CDN-based)
- **Language**: TypeScript compiled to JavaScript
- **Styling**: Custom CSS with responsive design
- **API Communication**: Native Fetch API

### Build Process
1. **Backend**: TypeScript → JavaScript in `dist/api/` folder
2. **Frontend**: TypeScript → JavaScript in `dist/frontend/` folder
3. **Static Assets**: Served directly from `public/` folder
4. **Frontend JS**: Served from `dist/frontend/` via `/js` route

## 🌐 API Endpoints

### Hello Endpoint
- `GET /api/hello` - Returns a hello message with timestamp

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `DELETE /api/users/:id` - Delete a user by ID

### Documentation
- `GET /swagger` - Interactive API documentation

## 🛠️ Development

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### Environment Variables
- `PORT` - Server port (default: 8080)

### File Watching
The development server (`npm run dev`) includes file watching exclusions to prevent "too many open files" errors:
- Excludes `node_modules/`, `dist/`, log files, and temporary files

### Error Handling
The server includes comprehensive error handling:
- Port conflict detection
- Graceful shutdown on SIGTERM/SIGINT
- Detailed error logging

## 📦 Dependencies

### Production
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **swagger-jsdoc**: API documentation generation
- **swagger-ui-express**: Swagger UI interface
- **vue**: Frontend framework (CDN)

### Development
- **typescript**: TypeScript compiler
- **ts-node-dev**: Development server with hot reload
- **@types/\***: TypeScript type definitions

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Configuration
Set the `PORT` environment variable to change the server port:
```bash
PORT=3000 npm start
```

## 📝 Notes

- **Data Persistence**: Currently uses in-memory storage for demonstration
- **Hot Reload**: Development server automatically restarts on file changes
- **TypeScript**: Full TypeScript support for both frontend and backend
- **API Documentation**: Swagger UI provides interactive API testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - see package.json for details
