import type { AnonymousParticipantRecord, DB } from '@/db';

export const anonymousParticipantTable = (db: DB) => {
    return {
        async getAnonymousParticipantById(id: string): Promise<AnonymousParticipantRecord | null> {
            return db.anonymousParticipant.findUnique({
                where: { id },
                include: {
                    participantRef: true,
                },
            });
        },
        async listAnonymousParticipantsByIds(ids: string[]): Promise<AnonymousParticipantRecord[]> {
            return db.anonymousParticipant.findMany({
                where: {
                    id: { in: ids },
                },
                include: {
                    participantRef: true,
                },
            });
        },
        async createAnonymousParticipant(gameId: string, displayName: string): Promise<AnonymousParticipantRecord> {
            return db.anonymousParticipant.create({
                data: {
                    displayName,
                    gameId,
                },
                include: {
                    participantRef: true,
                },
            });
        },
    };
};
