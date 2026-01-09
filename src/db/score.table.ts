import type { DB, ScoreRecord } from '@/db';

export const scoreTable = (db: DB) => {
    return {
        async createScore(handId: string, participantRefId: string, points: number): Promise<ScoreRecord> {
            return db.score.create({
                data: {
                    handId,
                    participantRefId,
                    points,
                },
            });
        },
    };
};
