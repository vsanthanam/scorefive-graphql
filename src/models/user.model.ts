import { ParticipantKind, type ParticipationMetadata } from '@/models/participationMetadata.model';

import type { UserRecord } from '@/db';

export type User = {
    __typename: 'User';
    id: string;
    displayName: string;
    emailAddress?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    participationMetadata: ParticipationMetadata[];
};

export const buildUser = (user: UserRecord): User => {
    const participationMetadata = user.participantRefs.map((ref) => {
        return {
            id: ref.id,
            gameId: ref.gameId,
            kind: ParticipantKind.USER,
            turnOrder: ref.turnOrder,
        };
    });
    return {
        __typename: 'User',
        id: user.id,
        displayName: user.displayName,
        emailAddress: user.emailAddress,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        participationMetadata,
    };
};
