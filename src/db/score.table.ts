import type { DB } from '@/db';

export const scoreTable = (db: DB) => {
    return {
        async createScore(data: { participantRefId: string; handId: string; points: number; gameId: string }): Promise<void> {
            await db.score.create({
                data: {
                    participantRefId: data.participantRefId,
                    handId: data.handId,
                    points: data.points,
                    gameId: data.gameId,
                },
            });
        },
        async deleteScoresByHandId(handId: string): Promise<void> {
            await db.score.deleteMany({
                where: {
                    handId,
                },
            });
        },
    };
};
