import type { DB } from '@/db';

export const scoreTable = (db: DB) => {
    return {
        async createScore(participantRefId: string, handId: string, points: number, gameId: string): Promise<void> {
            await db.score.create({
                data: {
                    participantRefId,
                    handId,
                    points,
                    gameId,
                },
            });
        },
    };
};
