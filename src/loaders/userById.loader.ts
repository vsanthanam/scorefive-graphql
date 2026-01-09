import DataLoader from 'dataloader';

import { userTable } from '@/db/user.table';

import type { DB, UserRecord } from '@/db';

const userById = (db: DB) => {
    return new DataLoader<string, UserRecord | null>(async (userIds) => {
        const records = await userTable(db).listUsersByIds([...userIds]);
        const cache = new Map<string, UserRecord>();
        for (const record of records) {
            cache.set(record.id, record);
        }
        return userIds.map((id) => cache.get(id) ?? null);
    });
};

export default userById;
