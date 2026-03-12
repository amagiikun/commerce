import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { AuthTokenPayload } from './contracts.js';

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function createAccessToken(
  payload: AuthTokenPayload,
  secret: string,
  expiresIn: string,
) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function decodeAccessToken(token: string, secret: string): AuthTokenPayload {
  const decoded = jwt.verify(token, secret);

  if (
    typeof decoded !== 'object'
    || !decoded.sub
    || !decoded.username
    || !decoded.role
    || !decoded.name
  ) {
    throw new Error('Invalid token payload');
  }

  return {
    sub: String(decoded.sub),
    username: String(decoded.username),
    role: decoded.role as AuthTokenPayload['role'],
    name: String(decoded.name),
    avatar: typeof decoded.avatar === 'string' ? decoded.avatar : undefined,
  };
}
