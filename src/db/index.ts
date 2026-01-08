import { PrismaPg } from '@prisma/adapter-pg';

import { Prisma, PrismaClient } from '@/__generated__/prisma/client';
import { databaseURL as connectionString } from '@/utils/env';

import type { User } from '@/__generated__/prisma/client';

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
