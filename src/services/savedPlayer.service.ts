import { savedPlayerRepo } from '@/db/savedPlayer.repo';
import { userService } from '@/services/user.service';

import type { GraphQLContext } from '@/graphql';
import type { SavedPlayer } from '@/models/savedPlayer.model';
import type { User } from '@/models/user.model';

export const savedPlayerService = (context: GraphQLContext) => {
    return {
        async savedPlayersForViewer(): Promise<SavedPlayer[]> {
            const viewer = await userService(context).viewer();
            return this.savedPlayersForUser(viewer);
        },
        async savedPlayersForUser(user: User): Promise<SavedPlayer[]> {
            const records = await context.loaders.savedPlayersForOwnerId.load(user.id);
            return records.map((record) => {
                return {
                    __typename: 'SavedPlayer',
                    id: record.id,
                    displayName: record.displayName,
                    ownerId: record.ownerId,
                    createdAt: record.createdAt,
                    updatedAt: record.updatedAt,
                };
            });
        },
        async savedPlayerById(id: string): Promise<SavedPlayer> {
            const record = await context.loaders.savedPlayerById.load(id);
            if (!record) {
                throw new Error(`SavedPlayer with ID ${id} not found`);
            }
            return {
                __typename: 'SavedPlayer',
                id: record.id,
                displayName: record.displayName,
                ownerId: record.ownerId,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
            };
        },
        async createSavedPlayerForViewer(displayName: string): Promise<SavedPlayer> {
            const viewer = await userService(context).viewer();
            return this.createSavedPlayer(viewer, displayName);
        },
        async createSavedPlayer(owner: User, displayName: string): Promise<SavedPlayer> {
            if (!displayName || displayName.trim() === '') {
                throw new Error('Display name cannot be empty');
            }
            const record = await savedPlayerRepo(context.db).createSavedPlayer(owner, displayName);
            return {
                __typename: 'SavedPlayer',
                id: record.id,
                displayName: record.displayName,
                ownerId: record.ownerId,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
            };
        },
    };
};
