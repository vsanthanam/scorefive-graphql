import { gameParticipantService } from '@/services/gameParticipant.services';
import { handService } from '@/services/hand.service';

import type { GraphQLContext } from '@/graphql';
import type { Game } from '@/models/game.model';
import type { ParticipantScore } from '@/models/participantScore.model';

export const participantScoreService = (context: GraphQLContext) => {
    return {
        async participantScoresForGame(game: Game): Promise<ParticipantScore[]> {
            const hands = await handService(context).handsForGame(game);
            const participants = await gameParticipantService(context).orderedParticipantsForGame(game);
            return participants.map((participant) => {
                const totalPoints = hands.reduce((sum, hand) => {
                    const handScore = hand.scores.find((score) => score.participant.id === participant.id);
                    return sum + (handScore ? handScore.points : 0);
                }, 0);
                return {
                    __typename: 'ParticipantScore',
                    game,
                    participant,
                    totalPoints,
                };
            });
        },
    };
};
