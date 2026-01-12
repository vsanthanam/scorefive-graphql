import { GraphQLError } from 'graphql';

import type { HandScoreResolvers } from '@/__generated__/graphql';

const handScore: HandScoreResolvers = {
    async hand(parent, _args, context) {
        try {
            return await context.services.hand.handById(parent.handId);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default handScore;
