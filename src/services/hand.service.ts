import { type Hand, buildHand } from '@/models/hand.model';

import type { GraphQLContext } from '@/graphql';
import type { Game } from '@/models/game.model';

export class HandService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async handsForGame(game: Game): Promise<Hand[]> {
        const records = await this.context.loaders.handsForGameId.load(game.id);
        return await Promise.all(
            records.map(async (record) => {
                return await buildHand(record, this.context);
            }),
        );
    }

    async handById(id: string): Promise<Hand> {
        const record = await this.context.loaders.handById.load(id);
        if (!record) {
            throw new Error(`Hand with id ${id} not found`);
        }
        return await buildHand(record, this.context);
    }

    private readonly context: GraphQLContext;
}
