import jwt, { type SignOptions } from 'jsonwebtoken';
import type { AuthTokenPayload } from '../contracts.js';
import { getEnv } from '../config/env.js';

export function signAccessToken(payload: AuthTokenPayload) {
  const env = getEnv();

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string) {
  const env = getEnv();

  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}
