import type { DB, UserRecord } from '@/db';

export const userTable = (db: DB) => {
    return {
        async getUserById(id: string): Promise<UserRecord | null> {
            return db.user.findUnique({
                where: { id },
                include: {
                    participantRefs: {
                        include: {
                            game: true,
                        },
                    },
                },
            });
        },
        async listUsersByIds(userIds: string[]): Promise<UserRecord[]> {
            return db.user.findMany({
                where: {
                    id: { in: userIds },
                },
                include: {
                    participantRefs: {
                        include: {
                            game: true,
                        },
                    },
                },
            });
        },
        async createOrUpdateUser(id: string, displayName?: string, emailAddress?: string, emailVerified?: boolean): Promise<UserRecord> {
            return await db.user.upsert({
                where: { id },
                create: {
                    id,
                    displayName: displayName ?? 'DefaultName',
                    emailAddress,
                    emailVerified,
                },
                update: {
                    displayName,
                    emailAddress,
                    emailVerified,
                },
                include: {
                    participantRefs: {
                        include: {
                            game: true,
                        },
                    },
                },
            });
        },
    };
};
