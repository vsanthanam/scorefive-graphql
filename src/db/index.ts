import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient, Prisma } from '@/__generated__/prisma/client';
import { databaseURL as connectionString } from '@/utils/env.utils';

const createPrismaClient = (): PrismaClient => {
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({
        adapter,
    });

    return prisma;
};

let prismaClient: PrismaClient | null = null;

export const getPrismaClient = (): PrismaClient => {
    if (!prismaClient) {
        prismaClient = createPrismaClient();
    }
    return prismaClient;
};

export type SavedPlayerRecord = Prisma.SavedPlayerGetPayload<{
    include: {
        owner: true;
        participantRefs: {
            include: {
                game: true;
            };
        };
    };
}>;

export type UserRecord = Prisma.UserGetPayload<{
    include: {
        participantRefs: {
            include: {
                game: true;
            };
        };
    };
}>;

export type AnonymousParticipantRecord = Prisma.AnonymousParticipantGetPayload<{
    include: {
        participantRef: true;
    };
}>;

export type ParticipantRefRecord = Prisma.ParticipantRefGetPayload<{
    include: {
        game: true;
        savedPlayer: true;
        user: true;
        anonymousParticipant: true;
    };
}>;

export type GameRecord = Prisma.GameGetPayload<{
    include: {
        owner: true;
        name: true;
        participantRefs: true;
    };
}>;

export type HandRecord = Prisma.HandGetPayload<{
    include: {
        game: true;
        scores: {
            include: {
                participantRef: {
                    include: {
                        game: true;
                        savedPlayer: true;
                        user: true;
                        anonymousParticipant: true;
                    };
                };
            };
        };
    };
}>;

export type DB = PrismaClient | Prisma.TransactionClient;
