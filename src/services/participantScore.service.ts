import type { GraphQLContext } from '@/graphql';
import type { Game } from '@/models/game.model';
import type { ParticipantScore } from '@/models/partcipantScore.model';

export class ParticipantScoreService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async participantScoresForGame(game: Game): Promise<ParticipantScore[]> {
        const hands = await this.context.services.hand.handsForGame(game);
        return game.orderedParticipants.map((participant) => {
            let totalPoints = 0;
            for (const hand of hands) {
                const handScore = hand.scores.find((score) => score.participant.id === participant.id);
                if (handScore) {
                    totalPoints += handScore.points;
                }
            }
            return {
                __typename: 'ParticipantScore',
                game,
                participant,
                totalPoints,
            };
        });
    }

    private readonly context: GraphQLContext;
}
