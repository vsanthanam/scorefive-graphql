import { anonymousParticipantTable } from '@/db/anonymousParticipant.table';
import { participantRefTable } from '@/db/participantRef.table';
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
        return this.createSavedPlayer({ owner: user, displayName });
    }

    async createSavedPlayer(data: { owner: User; displayName: string }): Promise<SavedPlayer> {
        if (data.displayName.length === 0) {
            throw new Error('Display name cannot be empty');
        }
        const savedPlayer = await savedPlayerTable(this.context.db).createSavedPlayer({ ownerId: data.owner.id, displayName: data.displayName });
        return buildSavedPlayer(savedPlayer, this.context);
    }

    async updateSavedPlayerDisplayName(data: { id: string; newDisplayName: string }): Promise<SavedPlayer> {
        if (data.newDisplayName.length === 0) {
            throw new Error('Display name cannot be empty');
        }
        const updatedSavedPlayer = await savedPlayerTable(this.context.db).updateSavedPlayerDisplayName({
            id: data.id,
            newDisplayName: data.newDisplayName,
        });
        return buildSavedPlayer(updatedSavedPlayer, this.context);
    }

    async deleteSavedPlayerById(id: string): Promise<boolean> {
        const savedPlayer = await this.savedPlayerById(id);
        if (!savedPlayer) {
            throw new Error(`SavedPlayer with ID ${id} not found`);
        }
        const canDelete = await this.context.services.game.canDeleteSavedPlayer(savedPlayer);
        if (!canDelete) {
            throw new Error('Cannot delete SavedPlayer who is participating in active games');
        }
        await this.context.db.$transaction(async (tx) => {
            for (const metadata of savedPlayer.participationMetadata) {
                const anonymous = await anonymousParticipantTable(tx).createAnonymousParticipant({
                    gameId: metadata.gameId,
                    displayName: savedPlayer.displayName,
                });
                await participantRefTable(tx).convertSavedPlayerToAnonymousParticipant({
                    participantRefId: metadata.id,
                    anonymousParticipantId: anonymous.id,
                });
            }
            await savedPlayerTable(tx).deleteSavedPlayerById(id);
        });
        return true;
    }

    private readonly context: GraphQLContext;
}
