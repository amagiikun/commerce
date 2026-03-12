import type { ApiResponse } from '../contracts.js';

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function success<T>(data: T, message = 'ok'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
  };
}
