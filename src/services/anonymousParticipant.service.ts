import { type AnonymousParticipant } from '@/models/anonymousParticipant.model';
import { ParticipantKind, type ParticipationMetadata } from '@/models/participationMetadata.model';

import type { AnonymousParticipantRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';

export class AnonymousParticipantService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async anonymousParticipantById(id: string): Promise<AnonymousParticipant> {
        const anonymousParticipant = await this.context.loaders.anonymousParticipantById.load(id);
        if (!anonymousParticipant) {
            throw new Error(`AnonymousParticipant with ID ${id} not found`);
        }
        return this.buildAnonymousParticipant(anonymousParticipant);
    }

    buildAnonymousParticipant(record: AnonymousParticipantRecord): AnonymousParticipant {
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
    }

    private context: GraphQLContext;
}
