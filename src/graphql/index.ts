import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';

import { PrismaClient } from '@/__generated__/prisma/client';
import resolvers from '@/graphql/resolvers';
import { introspection } from '@/utils/env';

import type { Loaders } from '@/loaders';
import type { Services } from '@/services';
import type { Server } from 'node:http';

export interface GraphQLContext {
    db: PrismaClient;
    userId: string;
    loaders: Loaders;
    services: Services;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const candidates = [
    // Preferred for production builds: copy schema next to compiled JS in dist/graphql/
    join(__dirname, 'schema.graphqls'),

    // Common local/dev layout when running from repository root
    join(process.cwd(), 'src', 'graphql', 'schema.graphqls'),
];

const typeDefsPath = candidates.find(existsSync);
if (!typeDefsPath) {
    throw new Error(`schema.graphqls not found. Tried:\n${candidates.join('\n')}`);
}

const typeDefs = readFileSync(typeDefsPath, { encoding: 'utf-8' });

const landingPage = [
    process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
];

export const createApolloServer = (httpServer: Server) => {
    const server = new ApolloServer<GraphQLContext>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ...landingPage],
        introspection,
    });
    return server;
};
