import { buildApp } from './app.js';
import { getEnv } from './config/env.js';
import { createPrismaRepository } from './data/prisma-repository.js';
import { prisma } from './lib/prisma.js';

const env = getEnv();
const app = buildApp({ repository: createPrismaRepository() });

const server = app.listen(env.port, () => {
  console.log(`smart-commerce backend listening on http://localhost:${env.port}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down gracefully`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
