import { GraphQLError } from 'graphql';

import { handService } from '@/services/hand.service';

import type { HandScoreResolvers } from '@/__generated__/graphql';

const handScore: HandScoreResolvers = {
    async hand(parent, _args, context) {
        try {
            return await handService(context).handById(parent.handId);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default handScore;
