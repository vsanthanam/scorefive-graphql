import pino from 'pino';

import { production, logLevel } from '@/utils/env.utils';

const productionLogger = {
    level: logLevel ?? 'info',
    base: null,
};

const debugLogger = {
    level: logLevel ?? 'debug',
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
