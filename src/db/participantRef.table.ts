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
        async createUserParticipantRef(data: { gameId: string; userId: string; turnOrder: number }): Promise<ParticipantRefRecord> {
            return db.participantRef.create({
                data: {
                    gameId: data.gameId,
                    userId: data.userId,
                    turnOrder: data.turnOrder,
                },
                include: {
                    game: true,
                    savedPlayer: true,
                    user: true,
                    anonymousParticipant: true,
                },
            });
        },
        async createSavedPlayerParticipantRef(data: { gameId: string; savedPlayerId: string; turnOrder: number }): Promise<ParticipantRefRecord> {
            return db.participantRef.create({
                data: {
                    gameId: data.gameId,
                    savedPlayerId: data.savedPlayerId,
                    turnOrder: data.turnOrder,
                },
                include: {
                    game: true,
                    savedPlayer: true,
                    user: true,
                    anonymousParticipant: true,
                },
            });
        },
        async createAnonymousParticipantRef(data: {
            gameId: string;
            anonymousParticipantId: string;
            turnOrder: number;
        }): Promise<ParticipantRefRecord> {
            return db.participantRef.create({
                data: {
                    gameId: data.gameId,
                    anonymousParticipantId: data.anonymousParticipantId,
                    turnOrder: data.turnOrder,
                },
                include: {
                    game: true,
                    savedPlayer: true,
                    user: true,
                    anonymousParticipant: true,
                },
            });
        },
        async convertSavedPlayerToAnonymousParticipant(data: {
            participantRefId: string;
            anonymousParticipantId: string;
        }): Promise<ParticipantRefRecord> {
            return db.participantRef.update({
                where: { id: data.participantRefId },
                data: {
                    savedPlayerId: null,
                    anonymousParticipantId: data.anonymousParticipantId,
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
