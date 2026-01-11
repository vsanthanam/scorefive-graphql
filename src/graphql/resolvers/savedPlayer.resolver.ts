import { GraphQLError } from 'graphql';

import type { SavedPlayerResolvers } from '@/__generated__/graphql';

const savedPlayer: SavedPlayerResolvers = {
    async participatingGames(parent, _args, context) {
        try {
            return await context.services.game.participatingGamesForSavedPlayer(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default savedPlayer;
