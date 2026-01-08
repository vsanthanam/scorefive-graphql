import type { DB, SavedPlayerRecord } from '@/db';
import type { User } from '@/models/user.model';

export const savedPlayerRepo = (db: DB) => {
    return {
        async createSavedPlayer(owner: User, displayName: string): Promise<SavedPlayerRecord> {
            return db.savedPlayer.create({
                data: {
                    ownerId: owner.id,
                    displayName,
                },
            });
        },
        async getSavedPlayerById(id: string): Promise<SavedPlayerRecord | null> {
            return db.savedPlayer.findUnique({
                where: { id },
            });
        },
        async listSavedPlayersForIds(ids: string[]): Promise<SavedPlayerRecord[]> {
            return db.savedPlayer.findMany({
                where: {
                    id: { in: ids },
                },
            });
        },
        async listSavedPlayersForOwnerId(ownerId: string): Promise<SavedPlayerRecord[]> {
            return db.savedPlayer.findMany({
                where: {
                    ownerId,
                },
            });
        },
        async listSavedPlayersForOwnerIds(ownerIds: string[]): Promise<SavedPlayerRecord[]> {
            return db.savedPlayer.findMany({
                where: {
                    ownerId: { in: ownerIds },
                },
            });
        },
    };
};
