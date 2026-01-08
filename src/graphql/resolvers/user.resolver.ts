import { GraphQLError } from 'graphql';

import { gameService } from '@/services/game.services';

import type { UserResolvers } from '@/__generated__/graphql';

const user: UserResolvers = {
    async participatingGames(parent, _args, context) {
        try {
            return await gameService(context).participatingGamesForUser(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default user;
