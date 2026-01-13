import { GameStatus, type AddHandInput } from '@/__generated__/graphql';
import { handTable } from '@/db/hand.table';
import { scoreTable } from '@/db/score.table';

import type { HandRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { Game } from '@/models/game.model';
import type { Hand } from '@/models/hand.model';
import type { HandScore } from '@/models/handScore.model';

export class HandService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async handsForGame(game: Game): Promise<Hand[]> {
        const records = await this.context.loaders.handsForGameId.load(game.id);
        return await Promise.all(
            records.map(async (record) => {
                return await this.buildHand(record);
            }),
        );
    }

    async handById(id: string): Promise<Hand> {
        const record = await this.context.loaders.handById.load(id);
        if (!record) {
            throw new Error(`Hand with id ${id} not found`);
        }
        return await this.buildHand(record);
    }

    async buildHand(record: HandRecord): Promise<Hand> {
        const scores: HandScore[] = await Promise.all(
            record.scores.map(async (scoreRecord) => {
                const participant = await this.context.services.gameParticipant.buildGameParticipant(scoreRecord.participantRef);
                return {
                    __typename: 'HandScore',
                    participant,
                    points: scoreRecord.points,
                    handId: record.id,
                };
            }),
        );
        return {
            __typename: 'Hand',
            id: record.id,
            scores,
            gameId: record.gameId,
            handNumber: record.handNumber,
        };
    }

    async createHand(input: AddHandInput): Promise<Hand> {
        const game = await this.context.services.game.gameById(input.gameId);
        const status = await this.context.services.gameStatus.gameStatusForGame(game);
        if (status === GameStatus.Completed) {
            throw new Error('Cannot add hand to a completed game');
        }
        const activeParticipants = await this.context.services.gameParticipant.activeParticipantsForGame(game);
        if (input.scores.length != activeParticipants.length) {
            throw new Error('Scores must be provided for all active participants');
        }
        if (activeParticipants.length < 2) {
            throw new Error('Cannot add hand to a game with less than 2 active participants');
        }

        for (const scoreInput of input.scores) {
            const participant = game.orderedParticipants.find((participant) => participant.id === scoreInput.participantId);
            if (!participant) {
                throw new Error(`Participant with ID ${scoreInput.participantId} not found in game ${game.id}`);
            }
            if (scoreInput.points < 0) {
                throw new Error('Score points cannot be negative');
            }
            if (scoreInput.points > 50) {
                throw new Error('Score points cannot be greater than 50');
            }
        }

        const zeroes = input.scores.filter((s) => s.points === 0);
        if (zeroes.length == 0) {
            throw new Error('At least one participant must have a score of zero');
        }
        if (zeroes.length == input.scores.length) {
            throw new Error('At least one participant must have a score greater than zero');
        }
        const handNumber = (await this.handsForGame(game)).length + 1;
        const id = await this.context.db.$transaction(async (tx) => {
            const record = await handTable(tx).createHand({ gameId: game.id, handNumber });
            for (const scoreInput of input.scores) {
                const participant = game.orderedParticipants.find((participant) => participant.id === scoreInput.participantId);
                if (!participant) {
                    throw new Error(`Participant not found`);
                }
                if (participant.__typename === 'User') {
                    const ref = participant.participationMetadata.find((pm) => pm.gameId === game.id);
                    if (!ref) {
                        throw new Error(`Participation metadata not found for user ${participant.id} in game ${game.id}`);
                    }
                    await scoreTable(tx).createScore({ participantRefId: ref.id, handId: record.id, points: scoreInput.points, gameId: game.id });
                } else if (participant.__typename === 'SavedPlayer') {
                    const ref = participant.participationMetadata.find((pm) => pm.gameId === game.id);
                    if (!ref) {
                        throw new Error(`Participation metadata not found for saved player ${participant.id} in game ${game.id}`);
                    }
                    await scoreTable(tx).createScore({ participantRefId: ref.id, handId: record.id, points: scoreInput.points, gameId: game.id });
                } else {
                    await scoreTable(tx).createScore({
                        participantRefId: participant.participationMetadata.id,
                        handId: record.id,
                        points: scoreInput.points,
                        gameId: game.id,
                    });
                }
            }
            return record.id;
        });
        return await this.handById(id);
    }

    private readonly context: GraphQLContext;
}
