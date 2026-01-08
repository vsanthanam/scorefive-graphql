import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { createLoaders } from '@/data/loaders';
import { getPrismaClient } from '@/db';
import { auth0Service } from '@/services/auth0.service';

import type { GraphQLContext } from '@/graphql';

const graphqlMiddleware = (server: ApolloServer<GraphQLContext>) => {
    return expressMiddleware(server, {
        context: async ({ req }) => {
            const auth = req.auth;
            if (!auth) {
                throw new Error('Unauthorized');
            }
            const payload = auth.payload ?? null;
            const token = auth.token ?? null;
            const db = getPrismaClient();
            const loaders = createLoaders(db);
            if (payload != null && token != null) {
                const sub = payload.sub;
                if (typeof sub !== 'string') {
                    throw new Error('Unknown Authorization Failure');
                }
                const existing = await auth0Service(db).lookupUserFromAuth0(payload);
                if (existing) {
                    return { userId: existing.id, db, loaders };
                }
                const user = await auth0Service(db).createOrUpdateUserFromAuth0(payload, token);
                return { userId: user.id, db, loaders };
            } else {
                throw new Error('Unauthorized');
            }
        },
    });
};

export default graphqlMiddleware;
