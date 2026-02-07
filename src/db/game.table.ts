import type { DB, GameRecord } from '@/db';

export const gameTable = (db: DB) => {
    return {
        async getGameById(id: string): Promise<GameRecord | null> {
            return db.game.findUnique({
                where: { id },
                include: {
                    owner: true,
                    participantRefs: true,
                },
            });
        },
        async listGamesByIds(ids: string[]): Promise<GameRecord[]> {
            return db.game.findMany({
                where: {
                    id: { in: ids },
                },
                include: {
                    owner: true,
                    participantRefs: {
                        orderBy: {
                            turnOrder: 'asc',
                        },
                    },
                },
            });
        },
        async listGamesForOwnerId(ownerId: string): Promise<GameRecord[]> {
            return db.game.findMany({
                where: {
                    ownerId,
                },
                include: {
                    owner: true,
                    participantRefs: {
                        orderBy: {
                            turnOrder: 'asc',
                        },
                    },
                },
            });
        },
        async listGamesForOwnerIds(ownerIds: string[]): Promise<GameRecord[]> {
            return db.game.findMany({
                where: {
                    ownerId: { in: ownerIds },
                },
                include: {
                    owner: true,
                    participantRefs: {
                        orderBy: {
                            turnOrder: 'asc',
                        },
                    },
                },
            });
        },
        async createGame(data: { ownerId: string; scoreLimit: number; gameName: string | null }): Promise<GameRecord> {
            return db.game.create({
                data: {
                    ownerId: data.ownerId,
                    scoreLimit: data.scoreLimit,
                    name: data.gameName,
                },
                include: {
                    owner: true,
                    participantRefs: {
                        orderBy: {
                            turnOrder: 'asc',
                        },
                    },
                },
            });
        },
        async deleteGameById(id: string): Promise<void> {
            await db.game.delete({
                where: { id },
            });
        },
        async updateGameName(id: string, newName: string | null): Promise<GameRecord> {
            return await db.game.update({
                where: { id },
                data: {
                    name: newName,
                },
                include: {
                    owner: true,
                    participantRefs: {
                        orderBy: {
                            turnOrder: 'asc',
                        },
                    },
                },
            });
        },
    };
};
