import { GameStatus } from '@/__generated__/graphql';
import { ParticipantRefType } from '@/__generated__/prisma/enums';
import { savedPlayerService } from '@/services/savedPlayer.service';
import { userService } from '@/services/user.service';

import { gameStatusService } from './gameStatus.service';
import { participantScoreService } from './participantScore.service';

import type { ParticipantRefRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { Game } from '@/models/game.model';
import type { GameParticipant } from '@/models/gameParticipant.model';

const assembleGameParticipant = async (
    context: GraphQLContext,
    record: ParticipantRefRecord,
): Promise<{ gameParticipant: GameParticipant; turnOrder: number }> => {
    if (record.referenceId !== null) {
        if (record.participantType === ParticipantRefType.USER) {
            const user = await userService(context).userById(record.referenceId);
            if (!user) {
                throw new Error(`User with ID ${record.referenceId} not found`);
            }
            return { gameParticipant: user, turnOrder: record.turnOrder };
        } else if (record.participantType === ParticipantRefType.SAVED_PLAYER) {
            const savedPlayer = await savedPlayerService(context).savedPlayerById(record.referenceId);
            if (!savedPlayer) {
                throw new Error(`SavedPlayer with ID ${record.referenceId} not found`);
            }
            return { gameParticipant: savedPlayer, turnOrder: record.turnOrder };
        } else {
            throw new Error(`Unknown participant type: ${record.participantType}`);
        }
    } else if (record.participantType === ParticipantRefType.ANONYMOUS) {
        if (!record.anonymousDisplayName) {
            throw new Error(`Anonymous player with ID ${record.referenceId} has no display name`);
        }
        const gameParticipant = {
            __typename: 'AnonymousParticipant' as const,
            id: record.id,
            displayName: record.anonymousDisplayName,
        };
        return { gameParticipant, turnOrder: record.turnOrder };
    } else {
        throw new Error(`Unknown participant type: ${record.participantType}`);
    }
};

export const gameParticipantService = (context: GraphQLContext) => {
    return {
        async buildParticipantFromRecord(record: ParticipantRefRecord): Promise<GameParticipant> {
            const { gameParticipant } = await assembleGameParticipant(context, record);
            return gameParticipant;
        },
        async gameParticipantById(id: string): Promise<GameParticipant> {
            const record = await context.loaders.participantRefById.load(id);
            if (!record) {
                throw new Error(`GameParticipant with ID ${id} not found`);
            }
            const { gameParticipant } = await assembleGameParticipant(context, record);
            return gameParticipant;
        },
        async orderedParticipantsForGame(game: Game): Promise<GameParticipant[]> {
            const records = await context.loaders.participantRefsForGameId.load(game.id);
            const gameParticipants = await Promise.all(records.map((record) => assembleGameParticipant(context, record)));
            return gameParticipants.map(({ gameParticipant }) => gameParticipant);
        },
        async activeParticipantsForGame(game: Game): Promise<GameParticipant[]> {
            const scores = await participantScoreService(context).participantScoresForGame(game);
            return scores
                .map((score) => {
                    const isActive = score.totalPoints < game.scoreLimit;
                    return { participant: score.participant, isActive };
                })
                .filter((participantWithStatus) => participantWithStatus.isActive)
                .map((participantWithStatus) => participantWithStatus.participant);
        },
        async winnerForGame(game: Game): Promise<GameParticipant> {
            const status = await gameStatusService(context).gameStatusForGame(game);
            if (status == GameStatus.Completed) {
                const activeParticipants = await this.activeParticipantsForGame(game);
                const winner = activeParticipants[0];
                if (!winner) {
                    throw new Error(`No active participants found for game with ID ${game.id}`);
                }
                return winner;
            } else {
                throw new Error(`Game with ID ${game.id} has no winner`);
            }
        },
    };
};
