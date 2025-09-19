import express from 'express';
import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import path from 'path';
import userRouter from './api/user/user';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
const publicDir = path.resolve(process.cwd(), 'public');
app.use(express.static(publicDir));

// Swagger configuration
const apis = [
  path.join(process.cwd(), 'api/**/*.ts'),
  path.join(process.cwd(), 'dist/api/**/*.js')
];

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple API',
      version: '1.0.0',
      description: 'A simple Express API with Vue.js frontend',
    },
    servers: [
      {
        url: '/',
        description: 'Current server',
      },
    ],
  },
  apis,
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI route
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Get a hello message
 *     tags: [Hello]
 *     responses:
 *       200:
 *         description: A hello message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
app.get('/api/hello', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'Hello from Express.js backend!',
    timestamp: new Date().toISOString()
  });
});

// Use user router
app.use('/api', userRouter);

// Serve Vue.js frontend for the root route
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Server startup and error handling
const port = Number(PORT);
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/swagger`);
});

server.on('error', (error: any) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try a different port.`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
