import { savedPlayerTable } from '@/db/savedPlayer.table';
import { type SavedPlayer, buildSavedPlayer } from '@/models/savedPlayer.model';

import type { GraphQLContext } from '@/graphql';
import type { User } from '@/models/user.model';

export class SavedPlayerService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async savedPlayerById(id: string): Promise<SavedPlayer> {
        const savedPlayer = await this.context.loaders.savedPlayerById.load(id);
        if (!savedPlayer) {
            throw new Error(`SavedPlayer with ID ${id} not found`);
        }
        return buildSavedPlayer(savedPlayer, this.context);
    }

    async savedPlayersForViewer(): Promise<SavedPlayer[]> {
        const user = await this.context.services.user.viewer();
        return this.savedPlayersForOwner(user);
    }

    async savedPlayersForOwner(owner: User): Promise<SavedPlayer[]> {
        const savedPlayers = await this.context.loaders.savedPlayersForOwnerId.load(owner.id);
        return await Promise.all(savedPlayers.map((sp) => buildSavedPlayer(sp, this.context)));
    }

    async createSavedPlayerForViewer(displayName: string): Promise<SavedPlayer> {
        const user = await this.context.services.user.viewer();
        return this.createSavedPlayer(user, displayName);
    }

    async createSavedPlayer(owner: User, displayName: string): Promise<SavedPlayer> {
        if (displayName.length === 0) {
            throw new Error('Display name cannot be empty');
        }
        const savedPlayer = await savedPlayerTable(this.context.db).createSavedPlayer(owner.id, displayName);
        return buildSavedPlayer(savedPlayer, this.context);
    }

    async updateSavedPlayerDisplayName(id: string, newDisplayName: string): Promise<SavedPlayer> {
        if (newDisplayName.length === 0) {
            throw new Error('Display name cannot be empty');
        }
        const updatedSavedPlayer = await savedPlayerTable(this.context.db).updateSavedPlayerDisplayName(id, newDisplayName);
        return buildSavedPlayer(updatedSavedPlayer, this.context);
    }

    private readonly context: GraphQLContext;
}
