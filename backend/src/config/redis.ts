import { createClient } from 'redis';
import logger from './logger';

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

// Connect to redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
  }
})();
