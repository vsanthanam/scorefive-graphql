import { GraphQLError } from 'graphql';

import type { HandResolvers } from '@/__generated__/graphql';

const hand: HandResolvers = {
    async game(parent, _args, context) {
        try {
            return await context.services.game.gameById(parent.gameId);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async canDelete(parent, _args, context) {
        try {
            return await context.services.hand.canDeleteHand(parent.id);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async canUpdate(parent, args, context) {
        try {
            return await context.services.hand.canUpdateHand({ id: parent.id, scores: args.scores });
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default hand;
