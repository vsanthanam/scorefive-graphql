import type { GameResolvers } from '@/__generated__/graphql';

const game: GameResolvers = {
    async hands(parent, _args, context) {
        try {
            return await context.services.hand.handsForGame(parent);
        } catch (error) {
            console.error('Error fetching hands for game:', error);
            throw error;
        }
    },
};

export default game;
