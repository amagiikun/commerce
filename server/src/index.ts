import { PrismaClient } from '@prisma/client';
import { createApp } from './app.js';
import { readServerConfig } from './config.js';
import { createPrismaRepository } from './data/prisma-repository.js';

const config = readServerConfig();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.databaseUrl,
    },
  },
});

const repository = createPrismaRepository(prisma);
const app = createApp({
  repository,
  jwtSecret: config.jwtSecret,
  jwtExpiresIn: config.jwtExpiresIn,
});

app.listen(config.port, () => {
  console.log(`server listening on http://localhost:${config.port}`);
});
