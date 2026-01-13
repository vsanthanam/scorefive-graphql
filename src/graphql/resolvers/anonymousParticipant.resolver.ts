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
    async activeGames(parent, _args, context) {
        try {
            const game = await context.services.game.activeGameForAnonymousParticipant(parent);
            return game ? [game] : [];
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async completedGames(parent, _args, context) {
        try {
            const game = await context.services.game.completedGameForAnonymousParticipant(parent);
            return game ? [game] : [];
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default anonymousParticipant;
