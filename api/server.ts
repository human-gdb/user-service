import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import path from 'path';
import userRouter from './user';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Swagger configuration
const swaggerOptions: any = {
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
  apis: ['./api/user/index.ts', './api/server.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

export { app, PORT };