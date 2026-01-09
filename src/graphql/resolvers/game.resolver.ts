import { GraphQLError } from 'graphql';

import { gameParticipantService } from '@/services/gameParticipant.services';
import { gameStatusService } from '@/services/gameStatus.service';
import { handService } from '@/services/hand.service';
import { participantScoreService } from '@/services/participantScore.service';

import type { GameResolvers } from '@/__generated__/graphql';

const game: GameResolvers = {
    async orderedParticipants(parent, _args, context) {
        try {
            return await gameParticipantService(context).orderedParticipantsForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async activeParticipants(parent, _args, context) {
        try {
            return await gameParticipantService(context).activeParticipantsForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async hands(parent, _args, context) {
        try {
            return await handService(context).handsForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async participantScores(parent, _args, context) {
        try {
            return await participantScoreService(context).participantScoresForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async status(parent, _args, context) {
        try {
            return await gameStatusService(context).gameStatusForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async winner(parent, _args, context) {
        try {
            return await gameParticipantService(context).winnerForGame(parent);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default game;
