import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to mask sensitive data in logs.
 * This is a simple implementation that masks 'username' and 'password' in the request body.
 */
export function maskSensitiveData(req: Request, res: Response, next: NextFunction) {
  const mask = '********';
  const sensitiveFields = [
    'username',
    'password',
    'telegramId',
    'first_name',
    'last_name',
    'phone_number',
  ];

  if (req.body) {
    const maskedBody = { ...req.body };
    let hasSensitive = false;

    for (const field of sensitiveFields) {
      if (maskedBody[field]) {
        maskedBody[field] = mask;
        hasSensitive = true;
      }
    }

    if (hasSensitive) {
      // We don't actually modify req.body for the rest of the app,
      // but we could attach a masked version for logging if we had a request logger middleware.
      // For now, this serves as a placeholder for where masking logic should live.
    }
  }

  next();
}
