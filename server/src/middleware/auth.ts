import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/api-response.js';
import { verifyAccessToken } from '../utils/jwt.js';

export function authenticateRequest(request: Request, _response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    next(new HttpError(401, '未登录或登录已过期'));
    return;
  }

  const token = authorization.slice('Bearer '.length).trim();

  if (!token) {
    next(new HttpError(401, '未登录或登录已过期'));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    request.user = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      name: payload.name,
      avatar: payload.avatar,
    };
    next();
  } catch {
    next(new HttpError(401, '未登录或登录已过期'));
  }
}
