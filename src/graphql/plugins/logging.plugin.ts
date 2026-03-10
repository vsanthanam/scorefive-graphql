import logger from '@/utils/logger.utils';

import type { GraphQLContext } from '@/graphql';
import type { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';

const graphqlLogger = logger.child({ component: 'graphql' });

export function loggingPlugin(): ApolloServerPlugin<GraphQLContext> {
    return {
        async requestDidStart(requestContext) {
            const start = Date.now();
            const operationName = requestContext.request.operationName ?? 'anonymous';

            graphqlLogger.info({ operationName }, 'Operation Began');

            const listener: GraphQLRequestListener<GraphQLContext> = {
                async didEncounterErrors(ctx) {
                    for (const error of ctx.errors) {
                        graphqlLogger.error(
                            {
                                operationName,
                                message: error.message,
                                path: error.path,
                                extensions: error.extensions,
                            },
                            'GraphQL Error',
                        );
                    }
                },
                async willSendResponse() {
                    const duration = Date.now() - start;
                    graphqlLogger.info({ operationName, duration }, 'Operation Completed');
                },
            };

            return listener;
        },
    };
}
