import express from 'express';
import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import path from 'path';
import userRouter from './user';

const app = express();
const PORT = process.env.PORT || 5000;

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

export { app, PORT };