import { GameStatus, type AddHandInput, type HandScoreInput, type UpdateHandInput } from '@/__generated__/graphql';
import { handTable } from '@/db/hand.table';
import { scoreTable } from '@/db/score.table';
import { validate } from '@/utils/five.utils';

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
        }

        validate(input.scores.map((s) => s.points));

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

    async deleteHandById(id: string): Promise<boolean> {
        const canDelete = await this.canDeleteHand(id);
        if (!canDelete) {
            throw new Error('Cannot delete this hand as it would change the active participants of previous hands');
        }
        const hand = await this.handById(id);
        const game = await this.context.services.game.gameById(hand.gameId);
        const hands = await this.handsForGame(game);
        const numberOfHands = hands.length;
        const isLast = hand.handNumber === numberOfHands;
        return await this.context.db.$transaction(async (tx) => {
            await scoreTable(tx).deleteScoresByHandId(hand.id);
            await handTable(tx).deleteHandById(hand.id);
            if (!isLast) {
                for (let i = hand.handNumber + 1; i <= numberOfHands; i++) {
                    const handToUpdate = hands.find((h) => h.handNumber === i);
                    if (handToUpdate) {
                        await handTable(tx).updateHandNumberForHandId({ id: handToUpdate.id, handNumber: i - 1 });
                    }
                }
            }
            return true;
        });
    }

    async canDeleteHand(id: string): Promise<boolean> {
        const hand = await this.handById(id);
        const game = await this.context.services.game.gameById(hand.gameId);
        const hands = await this.handsForGame(game);
        const numberOfHands = hands.length;
        const isLast = hand.handNumber === numberOfHands;
        if (!isLast) {
            const countActiveParticipants = (handsToScore: Hand[]) => {
                const totals = new Map<string, number>();
                for (const participant of game.orderedParticipants) {
                    totals.set(participant.id, 0);
                }
                for (const scoredHand of handsToScore) {
                    for (const score of scoredHand.scores) {
                        totals.set(score.participant.id, (totals.get(score.participant.id) ?? 0) + score.points);
                    }
                }
                let activeCount = 0;
                for (const participant of game.orderedParticipants) {
                    const total = totals.get(participant.id) ?? 0;
                    if (total < game.scoreLimit) {
                        activeCount++;
                    }
                }
                return activeCount;
            };
            const activeParticipantsCount = countActiveParticipants(hands);
            const activeParticipantsCountAfterDelete = countActiveParticipants(hands.filter((existing) => existing.id !== hand.id));
            return activeParticipantsCountAfterDelete === activeParticipantsCount;
        } else {
            return true;
        }
    }

    async canUpdateHand(data: { id: string; scores: HandScoreInput[] }): Promise<boolean> {
        const hand = await this.handById(data.id);
        const game = await this.context.services.game.gameById(hand.gameId);
        const hands = await this.handsForGame(game);
        const numberOfHands = hands.length;
        const isLast = hand.handNumber === numberOfHands;

        const handParticipantIds = new Set(hand.scores.map((score) => score.participant.id));
        if (handParticipantIds.size < 2) {
            return false;
        }
        if (data.scores.length !== handParticipantIds.size) {
            return false;
        }

        const seenParticipantIds = new Set<string>();
        for (const scoreInput of data.scores) {
            if (!handParticipantIds.has(scoreInput.participantId)) {
                return false;
            }
            if (seenParticipantIds.has(scoreInput.participantId)) {
                return false;
            }
            seenParticipantIds.add(scoreInput.participantId);
        }
        if (seenParticipantIds.size !== handParticipantIds.size) {
            return false;
        }

        try {
            validate(data.scores.map((s) => s.points));
        } catch {
            return false;
        }

        if (isLast) {
            return true;
        }

        const handIndex = hands.findIndex((existing) => existing.id === hand.id);
        if (handIndex === -1) {
            throw new Error(`Hand with id ${data.id} not found in game ${game.id}`);
        }

        const participantById = new Map<string, HandScore['participant']>();
        for (const score of hand.scores) {
            participantById.set(score.participant.id, score.participant);
        }

        const updatedScores: HandScore[] = data.scores.map((scoreInput) => {
            const participant = participantById.get(scoreInput.participantId);
            if (!participant) {
                throw new Error(`Participant with ID ${scoreInput.participantId} not found in hand ${hand.id}`);
            }
            return {
                __typename: 'HandScore',
                participant,
                points: scoreInput.points,
                handId: hand.id,
            };
        });

        const updatedHands = hands.map((existing) => {
            if (existing.id === hand.id) {
                return { ...existing, scores: updatedScores };
            }
            return existing;
        });

        const activeSetsByHand = (handsToScore: Hand[]): Set<string>[] => {
            const totals = new Map<string, number>();
            for (const participant of game.orderedParticipants) {
                totals.set(participant.id, 0);
            }
            const activeSets: Set<string>[] = [];
            for (const scoredHand of handsToScore) {
                for (const score of scoredHand.scores) {
                    totals.set(score.participant.id, (totals.get(score.participant.id) ?? 0) + score.points);
                }
                const activeSet = new Set<string>();
                for (const participant of game.orderedParticipants) {
                    const total = totals.get(participant.id) ?? 0;
                    if (total < game.scoreLimit) {
                        activeSet.add(participant.id);
                    }
                }
                activeSets.push(activeSet);
            }
            return activeSets;
        };

        const originalActiveSets = activeSetsByHand(hands);
        const updatedActiveSets = activeSetsByHand(updatedHands);

        const sameSet = (a: Set<string>, b: Set<string>) => {
            if (a.size !== b.size) {
                return false;
            }
            for (const value of a) {
                if (!b.has(value)) {
                    return false;
                }
            }
            return true;
        };

        for (let i = handIndex; i < hands.length; i++) {
            const originalSet = originalActiveSets[i];
            const updatedSet = updatedActiveSets[i];
            if (!originalSet || !updatedSet) {
                return false;
            }
            if (!sameSet(originalSet, updatedSet)) {
                return false;
            }
        }
        return true;
    }

    async updateHand(input: UpdateHandInput): Promise<Hand> {
        const canUpdate = await this.canUpdateHand({ id: input.handId, scores: input.scores });
        if (!canUpdate) {
            throw new Error('Cannot update this hand as it would change the active participants of subsequent hands');
        }
        const hand = await this.handById(input.handId);
        const game = await this.context.services.game.gameById(hand.gameId);

        await this.context.db.$transaction(async (tx) => {
            for (const scoreInput of input.scores) {
                const participant = game.orderedParticipants.find((p) => p.id === scoreInput.participantId);
                if (!participant) {
                    throw new Error(`Participant with ID ${scoreInput.participantId} not found in game ${game.id}`);
                }
                if (participant.__typename === 'User') {
                    const ref = participant.participationMetadata.find((pm) => pm.gameId === game.id);
                    if (!ref) {
                        throw new Error(`Participation metadata not found for user ${participant.id} in game ${game.id}`);
                    }
                    await scoreTable(tx).updateScorePoints({ participantRefId: ref.id, handId: hand.id, points: scoreInput.points, gameId: game.id });
                } else if (participant.__typename === 'SavedPlayer') {
                    const ref = participant.participationMetadata.find((pm) => pm.gameId === game.id);
                    if (!ref) {
                        throw new Error(`Participation metadata not found for saved player ${participant.id} in game ${game.id}`);
                    }
                    await scoreTable(tx).updateScorePoints({ participantRefId: ref.id, handId: hand.id, points: scoreInput.points, gameId: game.id });
                } else {
                    await scoreTable(tx).updateScorePoints({
                        participantRefId: participant.participationMetadata.id,
                        handId: hand.id,
                        points: scoreInput.points,
                        gameId: game.id,
                    });
                }
            }
        });

        this.context.loaders.handById.clear(hand.id);
        this.context.loaders.handsForGameId.clear(game.id);

        return await this.handById(hand.id);
    }

    private readonly context: GraphQLContext;
}
