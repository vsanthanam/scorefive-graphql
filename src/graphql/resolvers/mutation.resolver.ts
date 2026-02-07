import { GraphQLError } from 'graphql';

import type { MutationResolvers } from '@/__generated__/graphql';

const mutation: MutationResolvers = {
    async createSavedPlayer(_parent, args, context) {
        try {
            return await context.services.savedPlayer.createSavedPlayerForViewer(args.displayName);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async updateSavedPlayerDisplayName(_parent, args, context) {
        try {
            return await context.services.savedPlayer.updateSavedPlayerDisplayName({ id: args.savedPlayerId, newDisplayName: args.newDisplayName });
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async createGame(_parent, args, context) {
        try {
            return await context.services.game.createGameForViewer(args.input);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async addHand(_parent, args, context) {
        try {
            return await context.services.hand.createHand(args.input);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async deleteGame(_parent, args, context) {
        try {
            return await context.services.game.deleteGame(args.id);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async deleteSavedPlayer(_parent, args, context) {
        try {
            return await context.services.savedPlayer.deleteSavedPlayerById(args.id);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async deleteHand(_parent, args, context) {
        try {
            return await context.services.hand.deleteHandById(args.id);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async updateHand(_parent, args, context) {
        try {
            return await context.services.hand.updateHand(args.input);
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
    async updateGameName(_parent, args, context) {
        try {
            return await context.services.game.updateGameName({ gameId: args.gameId, newName: args.newName ?? null });
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default mutation;
