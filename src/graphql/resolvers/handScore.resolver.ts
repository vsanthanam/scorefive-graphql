import type { HandScoreResolvers } from '@/__generated__/graphql';

const handScore: HandScoreResolvers = {
    async hand(parent, _args, context) {
        try {
            return await context.services.hand.handById(parent.handId);
        } catch (error) {
            console.error('Error fetching hand for hand score:', error);
            throw error;
        }
    },
};

export default handScore;
