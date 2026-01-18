import { Request, Response, NextFunction } from 'express';

/**
 * IP Stripper Middleware
 *
 * According to GDPR-realization requirements:
 * Removes the IP address from the request object immediately after rate limiting
 * has been processed, ensuring it is not recorded in the database or logs.
 */
export const ipStripper = (req: Request, res: Response, next: NextFunction) => {
  // We cannot truly 'delete' it as it's a getter, but we can override it on the request object
  // for the rest of the pipeline.

  // Save a log entry that we are stripping (without the IP itself for privacy)
  // logger.debug('IP stripping applied to request');

  Object.defineProperty(req, 'ip', {
    value: 'stripped',
    writable: false,
    configurable: true,
  });

  // Also clear common headers that might contain the IP
  const headersToStrip = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'forwarded',
    'cf-connecting-ip',
    'true-client-ip',
  ];

  headersToStrip.forEach((header) => {
    if (req.headers[header]) {
      delete req.headers[header];
    }
  });

  next();
};
