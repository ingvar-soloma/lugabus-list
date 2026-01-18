import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'; // Security: Rate limiting
import routes from './routes';
import logger from './config/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { ipStripper } from './middlewares/ipStripper';

const app = express();
const port = process.env.PORT || 8080;

// Trust proxy for express-rate-limit (useful for ngrok, load balancers, etc.)
app.set('trust proxy', 1);

logger.info('Starting server initialization...');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (botToken) {
  logger.info('Telegram Bot Token Loaded', {
    length: botToken.length,
    hint: botToken.substring(0, 5) + '...' + botToken.substring(botToken.length - 3),
  });
} else {
  logger.warn('TELEGRAM_BOT_TOKEN is NOT defined in environment variables');
}

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.use(helmet());

import { redisClient } from './config/redis';
import { RedisStore } from 'rate-limit-redis';

// Security: Enable rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Security & GDPR: Strip IP after rate limiting to prevent tracking in DB/Logs
app.use(ipStripper);

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        logger.warn(`Origin ${origin} not allowed by CORS`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

import { maskSensitiveData } from './middlewares/logMasking';
app.use(maskSensitiveData);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

import { errorHandler } from './middlewares/errorMiddleware';

// ... existing imports ...

// Global error handler
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export default app;
