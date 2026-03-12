import 'dotenv/config';
import { AppError } from './errors.js';

export interface ServerConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export function readServerConfig(): ServerConfig {
  const port = Number(process.env.PORT ?? '3000');
  const databaseUrl = process.env.DATABASE_URL ?? '';
  const jwtSecret = process.env.JWT_SECRET ?? '';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

  if (!databaseUrl) {
    throw new AppError(500, '缺少 DATABASE_URL 配置');
  }

  if (!jwtSecret) {
    throw new AppError(500, '缺少 JWT_SECRET 配置');
  }

  return {
    port,
    databaseUrl,
    jwtSecret,
    jwtExpiresIn,
  };
}
