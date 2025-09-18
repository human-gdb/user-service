import { app, PORT } from './api/server';

const port = Number(process.env.PORT) || Number(PORT) || 5000;
const finalPort = Number.isNaN(port) ? 5000 : port;

app.listen(finalPort, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${finalPort}`);
  console.log(`Swagger UI available at http://localhost:${finalPort}/docs`);
});