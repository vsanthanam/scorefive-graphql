import pino from 'pino';

import { production } from '@/utils/env';

const productionLogger = {
    level: process.env.LOG_LEVEL ?? 'info',
    base: null,
};

const debugLogger = {
    level: process.env.LOG_LEVEL ?? 'debug',
    base: null,
};

const debugTransport = pino.transport({
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'SYS:standard',
        singleLine: true,
    },
});

const logger = production ? pino(productionLogger) : pino(debugLogger, debugTransport);

export default logger;
