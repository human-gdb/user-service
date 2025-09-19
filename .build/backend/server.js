"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const user_1 = __importDefault(require("./api/user/user"));
const search_1 = __importDefault(require("./api/search/search"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const frontendDir = path_1.default.resolve(process.cwd(), 'frontend');
const frontendBuildDir = path_1.default.resolve(process.cwd(), '.build/frontend');
app.use(express_1.default.static(frontendDir));
app.use('/js', express_1.default.static(frontendBuildDir));
app.use('/css', express_1.default.static(frontendDir));
// Swagger configuration
const apis = [
    path_1.default.join(process.cwd(), 'backend/api/**/*.ts'),
    path_1.default.join(process.cwd(), '.build/backend/api/**/*.js')
];
const swaggerOptions = {
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Swagger UI route
app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
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
app.get('/api/hello', (req, res) => {
    res.json({
        message: 'Hello from Express.js backend!',
        timestamp: new Date().toISOString()
    });
});
// Use routers
app.use('/api', user_1.default);
app.use('/api/search', search_1.default);
// Serve Vue.js frontend for the root route
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(frontendDir, 'index.html'));
});
// Server startup and error handling
const port = Number(PORT);
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/swagger`);
});
server.on('error', (error) => {
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
//# sourceMappingURL=server.js.map