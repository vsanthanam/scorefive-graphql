import { GraphQLError } from 'graphql';

import { gameService } from '@/services/game.services';
import { savedPlayerService } from '@/services/savedPlayer.service';
import { userService } from '@/services/user.service';

import type { QueryResolvers } from '@/__generated__/graphql';

const query: QueryResolvers = {
    async me(_parent, _args, context) {
        try {
            return await userService(context).viewer();
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async mySavedPlayers(_parent, _args, context) {
        try {
            return await savedPlayerService(context).savedPlayersForViewer();
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async savedPlayer(_parent, args, context) {
        try {
            return await await savedPlayerService(context).savedPlayerById(args.id);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async myGames(_parent, _args, context) {
        try {
            return await gameService(context).viewerGames();
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async game(_parent, args, context) {
        try {
            return await gameService(context).gameById(args.id);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default query;
