import { ApolloServer } from '@apollo/server';
import express from 'express';

import authMiddleware from '@/server/middleware/auth.middleware';
import corsMiddleware from '@/server/middleware/cors.middleware';
import graphqlMiddleware from '@/server/middleware/graphql.middleware';

import type { GraphQLContext } from '@/graphql';

export const createMiddlewares = (server: ApolloServer<GraphQLContext>) => [
    corsMiddleware,
    express.json(),
    authMiddleware,
    graphqlMiddleware(server),
];
