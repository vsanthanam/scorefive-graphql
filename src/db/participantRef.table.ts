import type { DB, ParticipantRefRecord } from '@/db';

export const participantRefTable = (db: DB) => {
    return {
        async getParticipantRefById(id: string): Promise<ParticipantRefRecord | null> {
            return db.participantRef.findUnique({
                where: { id },
                include: {
                    game: true,
                    savedPlayer: true,
                    user: true,
                    anonymousParticipant: true,
                },
            });
        },
        async listParticipantRefsByIds(ids: string[]): Promise<ParticipantRefRecord[]> {
            return db.participantRef.findMany({
                where: {
                    id: { in: ids },
                },
                include: {
                    game: true,
                    savedPlayer: true,
                    user: true,
                    anonymousParticipant: true,
                },
            });
        },
        async createUserParticipantRef(gameId: string, userId: string, turnOrder: number): Promise<ParticipantRefRecord> {
            return db.participantRef.create({
                data: {
                    gameId,
                    userId,
                    turnOrder,
                },
                include: {
                    game: true,
                    savedPlayer: true,
                    user: true,
                    anonymousParticipant: true,
                },
            });
        },
        async createSavedPlayerParticipantRef(gameId: string, savedPlayerId: string, turnOrder: number): Promise<ParticipantRefRecord> {
            return db.participantRef.create({
                data: {
                    gameId,
                    savedPlayerId,
                    turnOrder,
                },
                include: {
                    game: true,
                    savedPlayer: true,
                    user: true,
                    anonymousParticipant: true,
                },
            });
        },
        async createAnonymousParticipantRef(gameId: string, anonymousParticipantId: string, turnOrder: number): Promise<ParticipantRefRecord> {
            return db.participantRef.create({
                data: {
                    gameId,
                    anonymousParticipantId,
                    turnOrder,
                },
                include: {
                    game: true,
                    savedPlayer: true,
                    user: true,
                    anonymousParticipant: true,
                },
            });
        },
        async convertSavedPlayerToAnonymousParticipant(participantRefId: string, anonymousParticipantId: string): Promise<ParticipantRefRecord> {
            return db.participantRef.update({
                where: { id: participantRefId },
                data: {
                    savedPlayerId: null,
                    anonymousParticipantId,
                },
                include: {
                    game: true,
                    savedPlayer: true,
                    user: true,
                    anonymousParticipant: true,
                },
            });
        },
    };
};
