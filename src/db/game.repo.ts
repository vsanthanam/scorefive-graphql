import type { DB, GameRecord } from '@/db';

export const gameRepo = (db: DB) => {
    return {
        async createGame(ownerId: string, scoreLimit: number): Promise<GameRecord> {
            return db.game.create({
                data: {
                    ownerId,
                    scoreLimit,
                },
            });
        },
        async getGamesForOwnerId(ownerId: string): Promise<GameRecord[]> {
            return db.game.findMany({
                where: {
                    ownerId,
                },
            });
        },
        async listGamesForOwnerIds(ownerIds: string[]): Promise<GameRecord[]> {
            return db.game.findMany({
                where: {
                    ownerId: { in: ownerIds },
                },
            });
        },
        async getGameById(id: string): Promise<GameRecord | null> {
            return db.game.findUnique({
                where: { id },
            });
        },
        async listGamesForIds(ids: string[]): Promise<GameRecord[]> {
            return db.game.findMany({
                where: {
                    id: { in: ids },
                },
            });
        },
    };
};
