import DataLoader from 'dataloader';

import { userRepo } from '@/data/repositories/user.repo';

import type { DB, UserRecord } from '@/db';

const userById = (db: DB): DataLoader<string, UserRecord | null> => {
    return new DataLoader<string, UserRecord | null>(async (userIds) => {
        const users = await userRepo(db).listUsersByIds([...userIds]);
        const usersById = new Map(users.map((user) => [user.id, user]));

        return userIds.map((id) => usersById.get(id) ?? null);
    });
};

export default userById;
