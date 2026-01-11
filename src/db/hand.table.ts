import type { DB, HandRecord } from '@/db';

export const handTable = (db: DB) => {
    return {
        async getHandById(id: string): Promise<HandRecord | null> {
            return db.hand.findUnique({
                where: { id },
                include: {
                    game: true,
                    scores: {
                        include: {
                            participantRef: {
                                include: {
                                    game: true,
                                    savedPlayer: true,
                                    user: true,
                                    anonymousParticipant: true,
                                },
                            },
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
                    game: true,
                    scores: {
                        include: {
                            participantRef: {
                                include: {
                                    game: true,
                                    savedPlayer: true,
                                    user: true,
                                    anonymousParticipant: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    handNumber: 'asc',
                },
            });
        },
        async listHandsForGameId(gameId: string): Promise<HandRecord[]> {
            return db.hand.findMany({
                where: {
                    gameId,
                },
                include: {
                    game: true,
                    scores: {
                        include: {
                            participantRef: {
                                include: {
                                    game: true,
                                    savedPlayer: true,
                                    user: true,
                                    anonymousParticipant: true,
                                },
                            },
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
                    game: true,
                    scores: {
                        include: {
                            participantRef: {
                                include: {
                                    game: true,
                                    savedPlayer: true,
                                    user: true,
                                    anonymousParticipant: true,
                                },
                            },
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
