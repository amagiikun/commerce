import type { ErrorRequestHandler, RequestHandler } from 'express';
import { HttpError } from '../utils/api-response.js';

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({
    code: 404,
    message: '资源不存在',
    data: null,
  });
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof HttpError ? error.message : '服务异常，请稍后重试';

  if (!(error instanceof HttpError) && process.env.NODE_ENV !== 'test') {
    console.error(error);
  }

  response.status(statusCode).json({
    code: statusCode,
    message,
    data: null,
  });
};
