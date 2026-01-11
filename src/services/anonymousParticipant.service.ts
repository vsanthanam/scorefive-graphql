import { buildAnonymousParticipant, type AnonymousParticipant } from '@/models/anonymousParticipant.model';

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
        return buildAnonymousParticipant(anonymousParticipant);
    }

    private context: GraphQLContext;
}
