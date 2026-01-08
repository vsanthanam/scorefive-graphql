import corsMiddleware from '@/server/middleware/cors.middleware';
import authMiddleware from '@/server/middleware/auth.middleware';
import graphqlMiddleware from '@/server/middleware/graphql.middleware';
import express from 'express';
import { ApolloServer } from '@apollo/server';

import type { GraphQLContext } from '@/graphql';

export const createMiddlewares = (server: ApolloServer<GraphQLContext>) => [
    corsMiddleware,
    express.json(),
    authMiddleware,
    graphqlMiddleware(server),
];
