import { GraphQLError } from 'graphql';

import type { AnonymousParticipantResolvers } from '@/__generated__/graphql';

const anonymousParticipant: AnonymousParticipantResolvers = {
    async participatingGames(parent, _args, context) {
        try {
            const game = await context.services.game.participatingGameForAnonymousParticipant(parent);
            return [game];
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default anonymousParticipant;
