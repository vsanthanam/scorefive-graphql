import type { ParticipantRefRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { AnonymousParticipant } from '@/models/anonymousParticipant.model';
import type { SavedPlayer } from '@/models/savedPlayer.model';
import type { User } from '@/models/user.model';

export type GameParticipant = User | SavedPlayer | AnonymousParticipant;

export const buildGameParticipant = async (record: ParticipantRefRecord, context: GraphQLContext): Promise<GameParticipant> => {
    if (record.user) {
        return await context.services.user.userById(record.user.id);
    } else if (record.savedPlayer) {
        return await context.services.savedPlayer.savedPlayerById(record.savedPlayer.id);
    } else if (record.anonymousParticipant) {
        return await context.services.anonymousParticipant.anonymousParticipantById(record.anonymousParticipant.id);
    } else {
        throw new Error('Unknown participant type');
    }
};
