import pino from 'pino';

import { production } from '@/utils/env';

const logger = production
    ? pino({
          level: process.env.LOG_LEVEL ?? 'info',
          base: null,
      })
    : pino(
          {
              level: process.env.LOG_LEVEL ?? 'debug',
              base: null,
          },
          pino.transport({
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  singleLine: true,
              },
          }),
      );

export default logger;
