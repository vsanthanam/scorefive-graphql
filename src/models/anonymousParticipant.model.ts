import type { ParticipationMetadata } from '@/models/participationMetadata.model';

export type AnonymousParticipant = {
    __typename: 'AnonymousParticipant';
    id: string;
    displayName: string;
    participationMetadata: ParticipationMetadata;
};
