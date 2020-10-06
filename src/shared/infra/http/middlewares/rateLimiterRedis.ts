import { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import cacheConfig from '@config/cache';
import AppError from '@shared/errors/AppError';

const redisClient = new Redis(cacheConfig.config.redis);
export default async function rateLimiter(
  request: Request,
  _: Response,
  next: NextFunction,
): Promise<void> {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    points: 5,
    duration: 1,
  });
  try {
    await limiter.consume(request.ip);
    return next();
  } catch (err) {
    throw new AppError('Too many Requests', 429);
  }
}
