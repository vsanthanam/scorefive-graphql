import { buildGameParticipant } from './gameParticipant.model';

import type { HandRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { HandScore } from '@/models/handScore.model';

export type Hand = {
    id: string;
    scores: HandScore[];
    gameId: string;
};

export const buildHand = async (record: HandRecord, context: GraphQLContext): Promise<Hand> => {
    const scores: HandScore[] = await Promise.all(
        record.scores.map(async (scoreRecord) => {
            const participant = await buildGameParticipant(scoreRecord.participantRef, context);
            return {
                participant,
                points: scoreRecord.points,
                handId: record.id,
            };
        }),
    );
    return {
        id: record.id,
        scores,
        gameId: record.gameId,
    };
};
