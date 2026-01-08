import http from 'node:http';

import express from 'express';
import figlet from 'figlet';

import { getPrismaClient } from '@/db';
import { createApolloServer } from '@/graphql';
import { createMiddlewares } from '@/server/middleware';
import { port, logEnvironment } from '@/utils/env';
import logger from '@/utils/logger';

const start = async () => {
    const app = express();
    const server = http.createServer(app);
    const apollo = createApolloServer(server);

    await apollo.start();

    const message = figlet.textSync('ScoreFive');
    console.log(message);
    console.log('\n');
    logEnvironment();
    console.log('\n');

    app.use('/graphql', createMiddlewares(apollo));

    app.get('/', (_req, res) => {
        res.redirect(302, '/graphql');
    });

    await new Promise<void>((resolve) => {
        server.listen({ port }, () => {
            logger.info(`Server listening on http://localhost:${port}`);
            resolve();
        });
    });

    const db = getPrismaClient();
    const shutdown = async (signal: string) => {
        logger.info(`Received ${signal}, shutting down...`);
        await apollo.stop();
        await new Promise<void>((resolve, reject) => {
            server.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        await db.$disconnect();
    };

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
};

export default start;
