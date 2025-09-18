import { app, PORT } from './api/server';

const port = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/docs`);
});