import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

if (process.env.NODE_ENV === 'production') {
  // In production, you might want to log to a file or a different transport
  // For now, we'll just stick with the console transport
}

export default logger;
