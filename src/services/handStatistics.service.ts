import type { GraphQLContext } from '@/graphql';
import type { Hand } from '@/models/hand.model';
import type { HandStatistics } from '@/models/handStatistics.model';

export class HandStatisticsService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async handStatisticsForHand(hand: Hand): Promise<HandStatistics> {
        return this.context.loaders.handStatisticsForHand.load(hand);
    }

    private readonly context: GraphQLContext;
}
