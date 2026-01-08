import { gameParticipantService } from '@/services/gameParticipant.services';
import { handService } from '@/services/hand.service';
import { participantScoreService } from '@/services/participantScore.service';

import type { GameResolvers } from '@/__generated__/graphql';

const game: GameResolvers = {
    async orderedParticipants(parent, _args, context) {
        return await gameParticipantService(context).orderedParticipantsForGame(parent);
    },
    async hands(parent, _args, context) {
        return await handService(context).handsForGame(parent);
    },
    async participantScores(parent, _args, context) {
        return await participantScoreService(context).participantScoresForGame(parent);
    },
};

export default game;
