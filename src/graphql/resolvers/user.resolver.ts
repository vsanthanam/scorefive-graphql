import { GraphQLError } from 'graphql';

import type { UserResolvers } from '@/__generated__/graphql';

const user: UserResolvers = {
    async participatingGames(parent, _args, context) {
        try {
            return await context.services.game.participatingGamesForUser(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async activeGames(parent, _args, context) {
        try {
            return await context.services.game.activeGamesForUser(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async completedGames(parent, _args, context) {
        try {
            return await context.services.game.completedGamesForUser(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default user;
