import type { DB, SavedPlayerRecord } from '@/db';

export const savedPlayerTable = (db: DB) => {
    return {
        async getSavedPlayerById(id: string): Promise<SavedPlayerRecord | null> {
            return db.savedPlayer.findUnique({
                where: { id },
                include: {
                    owner: true,
                    participantRefs: {
                        include: {
                            game: true,
                        },
                    },
                },
            });
        },
        async listSavedPlayersForIds(ids: string[]): Promise<SavedPlayerRecord[]> {
            return db.savedPlayer.findMany({
                where: {
                    id: { in: ids },
                },
                include: {
                    owner: true,
                    participantRefs: {
                        include: {
                            game: true,
                        },
                    },
                },
            });
        },
        async listSavedPlayersForOwnerId(ownerId: string): Promise<SavedPlayerRecord[]> {
            return db.savedPlayer.findMany({
                where: {
                    ownerId,
                },
                include: {
                    owner: true,
                    participantRefs: {
                        include: {
                            game: true,
                        },
                    },
                },
            });
        },
        async listSavedPlayersForOwnerIds(ownerIds: string[]): Promise<SavedPlayerRecord[]> {
            return db.savedPlayer.findMany({
                where: {
                    ownerId: { in: ownerIds },
                },
                include: {
                    owner: true,
                    participantRefs: {
                        include: {
                            game: true,
                        },
                    },
                },
            });
        },
        async createSavedPlayer(data: { ownerId: string; displayName: string }): Promise<SavedPlayerRecord> {
            return await db.savedPlayer.create({
                data: {
                    ownerId: data.ownerId,
                    displayName: data.displayName,
                },
                include: {
                    owner: true,
                    participantRefs: {
                        include: {
                            game: true,
                        },
                    },
                },
            });
        },
        async updateSavedPlayerDisplayName(data: { id: string; newDisplayName: string }): Promise<SavedPlayerRecord> {
            return await db.savedPlayer.update({
                where: { id: data.id },
                data: {
                    displayName: data.newDisplayName,
                },
                include: {
                    owner: true,
                    participantRefs: {
                        include: {
                            game: true,
                        },
                    },
                },
            });
        },
        async deleteSavedPlayerById(id: string): Promise<void> {
            await db.savedPlayer.delete({
                where: { id },
            });
        },
    };
};
