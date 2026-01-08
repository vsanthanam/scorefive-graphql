import { ParticipantRefType } from '@/__generated__/prisma/enums';

import type { DB, ParticipantRefRecord } from '@/db';

export const participantRefTable = (db: DB) => {
    return {
        async getParticipantRefById(id: string): Promise<ParticipantRefRecord | null> {
            return await db.participantRef.findUnique({
                where: { id },
            });
        },
        async listParticipantRefsForIds(ids: string[]): Promise<ParticipantRefRecord[]> {
            return await db.participantRef.findMany({
                where: {
                    id: { in: ids },
                },
            });
        },
        async listParticipantRefsForGameId(gameId: string): Promise<ParticipantRefRecord[]> {
            return await db.participantRef.findMany({
                where: {
                    gameId,
                },
                orderBy: {
                    turnOrder: 'asc',
                },
            });
        },
        async listParticipantRefsForGameIds(gameIds: string[]): Promise<ParticipantRefRecord[]> {
            return await db.participantRef.findMany({
                where: {
                    gameId: { in: gameIds },
                },
                orderBy: {
                    turnOrder: 'asc',
                },
            });
        },
        async createUserParticipantRef(userId: string, gameId: string, turnOrder: number): Promise<ParticipantRefRecord> {
            return await db.participantRef.create({
                data: {
                    referenceId: userId,
                    participantType: ParticipantRefType.USER,
                    gameId,
                    turnOrder,
                },
            });
        },
        async createSavedPlayerParticipantRef(savedPlayerId: string, gameId: string, turnOrder: number): Promise<ParticipantRefRecord> {
            return await db.participantRef.create({
                data: {
                    referenceId: savedPlayerId,
                    participantType: ParticipantRefType.SAVED_PLAYER,
                    gameId,
                    turnOrder,
                },
            });
        },
        async createAnonymousParticipantRef(anonymousDisplayName: string, gameId: string, turnOrder: number): Promise<ParticipantRefRecord> {
            return await db.participantRef.create({
                data: {
                    referenceId: null,
                    participantType: ParticipantRefType.ANONYMOUS,
                    anonymousDisplayName,
                    gameId,
                    turnOrder,
                },
            });
        },
        async listParticipantRefsForUserId(userId: string): Promise<ParticipantRefRecord[]> {
            return await db.participantRef.findMany({
                where: {
                    participantType: ParticipantRefType.USER,
                    referenceId: userId,
                },
            });
        },
        async listParticipantRefsForUserIds(userIds: string[]): Promise<ParticipantRefRecord[]> {
            return await db.participantRef.findMany({
                where: {
                    participantType: ParticipantRefType.USER,
                    referenceId: { in: userIds },
                },
            });
        },
        async listParticipantRefsForSavedPlayerId(savedPlayerId: string): Promise<ParticipantRefRecord[]> {
            return await db.participantRef.findMany({
                where: {
                    participantType: ParticipantRefType.SAVED_PLAYER,
                    referenceId: savedPlayerId,
                },
            });
        },
        async listParticipantRefsForSavedPlayerIds(savedPlayerIds: string[]): Promise<ParticipantRefRecord[]> {
            return await db.participantRef.findMany({
                where: {
                    participantType: ParticipantRefType.SAVED_PLAYER,
                    referenceId: { in: savedPlayerIds },
                },
            });
        },
    };
};
