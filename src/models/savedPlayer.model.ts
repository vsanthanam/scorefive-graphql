import { ParticipantKind, type ParticipationMetadata } from '@/models/participationMetadata.model';

import type { SavedPlayerRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { User } from '@/models/user.model';

export type SavedPlayer = {
    __typename: 'SavedPlayer';
    id: string;
    displayName: string;
    owner: User;
    participationMetadata: ParticipationMetadata[];
};

export const buildSavedPlayer = async (record: SavedPlayerRecord, context: GraphQLContext): Promise<SavedPlayer> => {
    const participationMetadata = record.participantRefs.map((ref) => {
        return {
            id: ref.id,
            gameId: ref.gameId,
            kind: ParticipantKind.SAVED_PLAYER,
            turnOrder: ref.turnOrder,
        };
    });
    const owner = await context.services.user.userById(record.ownerId);
    return {
        __typename: 'SavedPlayer',
        id: record.id,
        displayName: record.displayName,
        owner,
        participationMetadata,
    };
};
