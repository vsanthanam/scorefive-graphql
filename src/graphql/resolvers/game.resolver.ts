import { GraphQLError } from 'graphql';

import type { GameResolvers } from '@/__generated__/graphql';

const game: GameResolvers = {
    async hands(parent, _args, context) {
        try {
            return await context.services.hand.handsForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async status(parent, _args, context) {
        try {
            return await context.services.gameStatus.gameStatusForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async activeParticipants(parent, _args, context) {
        try {
            return await context.services.gameParticipant.activeParticipantsForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async winner(parent, _args, context) {
        try {
            return await context.services.gameParticipant.winnerForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async participantScores(parent, _args, context) {
        try {
            return await context.services.participantScore.participantScoresForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default game;
