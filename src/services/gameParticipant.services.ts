import { ParticipantRefType } from '@/__generated__/prisma/enums';
import { savedPlayerService } from '@/services/savedPlayer.service';
import { userService } from '@/services/user.service';

import type { ParticipantRefRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { Game } from '@/models/game.model';
import type { GameParticipant } from '@/models/gameParticipant.model';

const assembleGameParticipant = async (context: GraphQLContext, record: ParticipantRefRecord): Promise<{ gameParticipant: GameParticipant; turnOrder: number }> => {
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
        async orderedParticipantsForGame(game: Game): Promise<GameParticipant[]> {
            const participantRefRecords = await context.loaders.participantRefsForGameId.load(game.id);
            const assembledParticipants = await Promise.all(participantRefRecords.map((record) => assembleGameParticipant(context, record)));
            assembledParticipants.sort((a, b) => a.turnOrder - b.turnOrder);
            return assembledParticipants.map((ap) => ap.gameParticipant);
        },
    };
};
