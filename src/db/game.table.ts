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
        async createGame(ownerId: string, scoreLimit: number): Promise<GameRecord> {
            return db.game.create({
                data: {
                    ownerId,
                    scoreLimit,
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
    };
};
