import { GraphQLError } from 'graphql';

import { gameService } from '@/services/game.services';

import type { AnonymousParticipantResolvers } from '@/__generated__/graphql';

const anonymousParticipant: AnonymousParticipantResolvers = {
    async participatingGames(parent, _args, context) {
        try {
            const game = await gameService(context).participatingGameForAnonymousParticipant(parent);
            return [game];
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default anonymousParticipant;
