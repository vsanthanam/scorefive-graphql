import { GraphQLError } from 'graphql';

import { gameService } from '@/services/game.services';
import { savedPlayerService } from '@/services/savedPlayer.service';

import type { MutationResolvers } from '@/__generated__/graphql';

const mutation: MutationResolvers = {
    async createSavedPlayer(_parent, args, context) {
        try {
            return await savedPlayerService(context).createSavedPlayerForViewer(args.displayName);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async createGame(_parent, args, context) {
        try {
            return await gameService(context).createGameForViewer(args.input);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default mutation;
