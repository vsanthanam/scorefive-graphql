import type { DB, HandRecord } from '@/db';

export const handRepo = (db: DB) => {
    return {
        async getHandById(id: string): Promise<HandRecord | null> {
            return db.hand.findUnique({
                where: { id },
                include: {
                    scores: {
                        include: {
                            participantRef: true,
                        },
                    },
                },
            });
        },
        async listHandsForIds(ids: string[]): Promise<HandRecord[]> {
            return db.hand.findMany({
                where: {
                    id: { in: ids },
                },
                include: {
                    scores: {
                        include: {
                            participantRef: true,
                        },
                    },
                },
            });
        },
        async listHandsForGameId(gameId: string): Promise<HandRecord[]> {
            return db.hand.findMany({
                where: {
                    gameId,
                },
                include: {
                    scores: {
                        include: {
                            participantRef: true,
                        },
                    },
                },
                orderBy: {
                    handNumber: 'asc',
                },
            });
        },
        async listHandsForGameIds(gameIds: string[]): Promise<HandRecord[]> {
            return db.hand.findMany({
                where: {
                    gameId: { in: gameIds },
                },
                include: {
                    scores: {
                        include: {
                            participantRef: true,
                        },
                    },
                },
                orderBy: {
                    handNumber: 'asc',
                },
            });
        },
    };
};
