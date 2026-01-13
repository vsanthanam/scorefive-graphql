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
    async activeGames(parent, _args, context) {
        try {
            return await context.services.game.activeGamesForSavedPlayer(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async completedGames(parent, _args, context) {
        try {
            return await context.services.game.completedGamesForSavedPlayer(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async canDelete(parent, _args, context) {
        try {
            return await context.services.game.canDeleteSavedPlayer(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default savedPlayer;
