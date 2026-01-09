import type { HandResolvers } from '@/__generated__/graphql';

const hand: HandResolvers = {
    async game(parent, _args, context) {
        try {
            return await context.services.game.gameById(parent.gameId);
        } catch (error) {
            console.error('Error fetching game for hand:', error);
            throw error;
        }
    },
};

export default hand;
