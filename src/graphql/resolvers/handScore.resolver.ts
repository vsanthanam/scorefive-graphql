import { handService } from '@/services/hand.service';

import type { HandScoreResolvers } from '@/__generated__/graphql';

const handScore: HandScoreResolvers = {
    async hand(parent, _args, context) {
        return await handService(context).handById(parent.handId);
    },
};

export default handScore;
