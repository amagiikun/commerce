import { Router } from 'express';
import type { LoginRequest, LoginResponse } from '../contracts.js';
import type { AppRepository } from '../data/repository.js';
import { asyncHandler } from '../utils/async-handler.js';
import { HttpError, success } from '../utils/api-response.js';
import { signAccessToken } from '../utils/jwt.js';
import { comparePassword } from '../utils/password.js';

function readLoginPayload(body: unknown): LoginRequest {
  const payload = (body ?? {}) as Partial<LoginRequest>;
  const username = String(payload.username ?? '').trim();
  const password = String(payload.password ?? '').trim();

  if (!username || !password) {
    throw new HttpError(400, '用户名和密码不能为空');
  }

  return {
    username,
    password,
    role: payload.role,
  };
}

export function createAuthRouter(repository: AppRepository) {
  const router = Router();

  router.post(
    '/login',
    asyncHandler(async (request, response) => {
      const payload = readLoginPayload(request.body);
      const currentUser = await repository.findUserByUsername(payload.username);

      if (!currentUser || !(await comparePassword(payload.password, currentUser.passwordHash))) {
        throw new HttpError(401, '用户名或密码错误');
      }

      const result: LoginResponse = {
        token: signAccessToken({
          sub: currentUser.id,
          username: currentUser.username,
          role: currentUser.role,
          name: currentUser.name,
          avatar: currentUser.avatar,
        }),
        role: currentUser.role,
        userInfo: {
          id: currentUser.id,
          name: `${currentUser.name} · ${repository.getRoleLabel(currentUser.role)}`,
          role: currentUser.role,
          avatar: currentUser.avatar,
        },
      };

      response.json(success(result, '登录成功'));
    }),
  );

  return router;
}
