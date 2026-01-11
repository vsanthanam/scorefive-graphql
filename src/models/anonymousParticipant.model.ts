import { ParticipantKind, type ParticipationMetadata } from '@/models/participationMetadata.model';

import type { AnonymousParticipantRecord } from '@/db';

export type AnonymousParticipant = {
    __typename: 'AnonymousParticipant';
    id: string;
    displayName: string;
    participationMetadata: ParticipationMetadata;
};

export const buildAnonymousParticipant = (record: AnonymousParticipantRecord): AnonymousParticipant => {
    if (!record.participantRef) {
        throw new Error('AnonymousParticipantRecord is missing participantRef');
    }
    const participationMetadata: ParticipationMetadata = {
        id: record.participantRef.id,
        gameId: record.participantRef.gameId,
        kind: ParticipantKind.ANONYMOUS_PARTICIPANT,
        turnOrder: record.participantRef.turnOrder,
    };
    return {
        __typename: 'AnonymousParticipant',
        id: record.id,
        displayName: record.displayName,
        participationMetadata,
    };
};
