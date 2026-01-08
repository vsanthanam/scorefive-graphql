import { gameService } from '@/services/game.services';
import { gameParticipantService } from '@/services/gameParticipant.services';

import type { HandRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { Game } from '@/models/game.model';
import type { Hand } from '@/models/hand.model';

const buildHand = async (record: HandRecord, context: GraphQLContext, game: Game | null): Promise<Hand> => {
    const scores = await Promise.all(
        record.scores.map(async (scoreRecord) => {
            const gameParticipant = await gameParticipantService(context).buildParticipantFromRecord(scoreRecord.participantRef);
            return {
                __typename: 'HandScore' as const,
                id: scoreRecord.id,
                participant: gameParticipant,
                points: scoreRecord.points,
                handId: record.id,
            };
        }),
    );
    if (!game) {
        const game = await gameService(context).gameById(record.gameId);
        return {
            __typename: 'Hand' as const,
            id: record.id,
            handNumber: record.handNumber,
            game: game,
            scores,
        };
    } else {
        return {
            __typename: 'Hand' as const,
            id: record.id,
            handNumber: record.handNumber,
            game: game,
            scores,
        };
    }
};

export const handService = (context: GraphQLContext) => {
    return {
        async handsForGame(game: Game): Promise<Hand[]> {
            const records = await context.loaders.handsForGameId.load(game.id);
            const hands = await Promise.all(
                records.map(async (record) => {
                    return buildHand(record, context, game);
                }),
            );
            return hands;
        },
        async handById(id: string): Promise<Hand> {
            const record = await context.loaders.handById.load(id);
            if (!record) {
                throw new Error(`Hand with ID ${id} not found`);
            }
            return buildHand(record, context, null);
        },
    };
};
