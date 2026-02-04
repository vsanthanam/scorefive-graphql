import type { DB, HandRecord } from '@/db';

export const handTable = (db: DB) => {
    return {
        async getHandById(id: string): Promise<HandRecord | null> {
            return await db.hand.findUnique({
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
            return await db.hand.findMany({
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
            return await db.hand.findMany({
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
            return await db.hand.findMany({
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
        async createHand(data: { gameId: string; handNumber: number }): Promise<HandRecord> {
            return await db.hand.create({
                data: {
                    gameId: data.gameId,
                    handNumber: data.handNumber,
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
            });
        },
        async deleteHandById(id: string): Promise<void> {
            await db.hand.delete({
                where: { id },
            });
        },
        async updateHandNumberForHandId(data: { id: string; handNumber: number }): Promise<HandRecord> {
            return await db.hand.update({
                where: { id: data.id },
                data: { handNumber: data.handNumber },
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
        async handByNumberInGame(gameId: string, handNumber: number): Promise<HandRecord | null> {
            return await db.hand.findFirst({
                where: {
                    gameId,
                    handNumber,
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
            });
        },
    };
};
