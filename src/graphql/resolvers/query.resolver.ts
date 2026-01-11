import { GraphQLError } from 'graphql';

import type { QueryResolvers } from '@/__generated__/graphql';

const query: QueryResolvers = {
    async me(_parent, _args, context) {
        try {
            return await context.services.user.viewer();
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async mySavedPlayers(_parent, _args, context) {
        try {
            return await context.services.savedPlayer.savedPlayersForViewer();
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async savedPlayer(_parent, args, context) {
        try {
            return await context.services.savedPlayer.savedPlayerById(args.id);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async myGames(_parent, _args, context) {
        try {
            return await context.services.game.gamesForViewer();
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async game(_parent, args, context) {
        try {
            return await context.services.game.gameById(args.id);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default query;
