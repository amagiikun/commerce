import { config } from 'dotenv';

config();

interface AppEnv {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const port = Number(process.env.PORT ?? 3000);
  const databaseUrl = process.env.DATABASE_URL ?? 'mysql://root:password@localhost:3306/smart_commerce_admin';
  const jwtSecret = process.env.JWT_SECRET ?? 'smart-commerce-dev-secret';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('PORT 必须是有效的正整数');
  }

  if (isProduction && !process.env.DATABASE_URL) {
    throw new Error('生产环境缺少 DATABASE_URL 环境变量');
  }

  if (isProduction && !process.env.JWT_SECRET) {
    throw new Error('生产环境缺少 JWT_SECRET 环境变量');
  }

  cachedEnv = {
    port,
    databaseUrl,
    jwtSecret,
    jwtExpiresIn,
  };

  return cachedEnv;
}
