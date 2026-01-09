import { GraphQLError } from 'graphql';

import { gameService } from '@/services/game.services';
import { userService } from '@/services/user.service';

import type { SavedPlayerResolvers } from '@/__generated__/graphql';

const savedPlayer: SavedPlayerResolvers = {
    async owner(parent, _args, context) {
        try {
            return await userService(context).userById(parent.ownerId);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async participatingGames(parent, _args, context) {
        try {
            return await gameService(context).participatingGamesForSavedPlayer(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default savedPlayer;
