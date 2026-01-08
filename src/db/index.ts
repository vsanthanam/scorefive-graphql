import { PrismaPg } from '@prisma/adapter-pg';

import { Prisma, PrismaClient } from '@/__generated__/prisma/client';
import { databaseURL as connectionString } from '@/utils/env';

import type { User, SavedPlayer, Game, ParticipantRef } from '@/__generated__/prisma/client';

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

export type DB = PrismaClient | Prisma.TransactionClient;
export type UserRecord = User;
export type SavedPlayerRecord = SavedPlayer;
export type GameRecord = Game;
export type ParticipantRefRecord = ParticipantRef;
export type HandRecord = Prisma.HandGetPayload<{
    include: {
        scores: {
            include: {
                participantRef: true;
            };
        };
    };
}>;
