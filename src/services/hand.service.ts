import { GameStatus, type AddHandInput } from '@/__generated__/graphql';
import { handTable } from '@/db/hand.table';
import { participantRefTable } from '@/db/participantRef.table';
import { scoreTable } from '@/db/score.table';
import { gameService } from '@/services/game.services';
import { gameParticipantService } from '@/services/gameParticipant.services';
import { gameStatusService } from '@/services/gameStatus.service';

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
        async createHand(input: AddHandInput): Promise<Hand> {
            const game = await gameService(context).gameById(input.gameId);
            if (!game) {
                throw new Error(`Game with ID ${input.gameId} not found`);
            }
            const status = await gameStatusService(context).gameStatusForGame(game);
            if (status === GameStatus.Completed) {
                throw new Error(`Cannot add hand to completed game with ID ${game.id}`);
            }
            const activeParticipants = await gameParticipantService(context).activeParticipantsForGame(game);
            for (const scoreInput of input.scores) {
                const participant = activeParticipants.find((participant) => participant.id === scoreInput.participantId);
                if (!participant) {
                    throw new Error(`Participant with ID ${scoreInput.participantId} is not active in game ${game.id}`);
                }
            }
            if (input.scores.length !== activeParticipants.length) {
                throw new Error(`Scores must be provided for all active participants in game ${game.id}`);
            }
            const scores = input.scores.map((score) => score.points);
            for (const points of scores) {
                if (points < 0 || points > 50) {
                    throw new Error('Points must be between 0 and 50');
                }
            }
            const zeroes = scores.filter((points) => points === 0);
            if (zeroes.length === 0) {
                throw new Error('At least one participant must have zero points in a hand');
            }
            if (zeroes.length === scores.length) {
                throw new Error('At least one participant must have more than zero points in a hand');
            }
            const nextHandNumber = (await this.handsForGame(game)).length + 1;
            const id = await context.db.$transaction(async (tx) => {
                const handRecord = await handTable(tx).createHand(game.id, nextHandNumber);
                for (const scoreInput of input.scores) {
                    const ref = await participantRefTable(tx).getParticipantByReferenceId(scoreInput.participantId, game.id);
                    if (ref) {
                        await scoreTable(tx).createScore(handRecord.id, ref.id, scoreInput.points);
                    } else {
                        const ref = await context.loaders.participantRefById.load(scoreInput.participantId);
                        if (!ref) {
                            throw new Error(`ParticipantRef with ID ${scoreInput.participantId} not found`);
                        }
                        await scoreTable(tx).createScore(handRecord.id, ref.id, scoreInput.points);
                    }
                }
                return handRecord.id;
            });
            const hand = await this.handById(id);
            if (!hand) {
                throw new Error('Hand not found after creation');
            }
            return hand;
        },
    };
};
