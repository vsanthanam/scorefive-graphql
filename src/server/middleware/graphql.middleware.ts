import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { getPrismaClient } from '@/db';
import { createLoaders } from '@/loaders';
import { createServices } from '@/services';
import { Auth0Service } from '@/services/auth0.service';

import type { GraphQLContext } from '@/graphql';

const graphqlMiddleware = (server: ApolloServer<GraphQLContext>) => {
    return expressMiddleware(server, {
        context: async ({ req }) => {
            const auth = req.auth;
            if (!auth) {
                throw new Error('Unauthorized');
            }
            const payload = auth.payload ?? null;
            const accessToken = auth.token ?? null;
            const db = getPrismaClient();
            const auth0 = new Auth0Service(db);
            const loaders = createLoaders(db);
            let context: GraphQLContext;
            const services = createServices(() => context);
            if (payload != null && accessToken != null) {
                const sub = payload.sub;
                if (typeof sub !== 'string') {
                    throw new Error('Unknown Authorization Failure');
                }
                const existing = await auth0.lookupUserFromAuth0(payload);
                if (existing) {
                    context = { userId: existing.id, db, loaders, services };
                    return context;
                }
                const user = await auth0.createOrUpdateUserFromAuth0({ payload, accessToken });
                context = { userId: user.id, db, loaders, services };
                return context;
            } else {
                throw new Error('Unauthorized');
            }
        },
    });
};

export default graphqlMiddleware;
