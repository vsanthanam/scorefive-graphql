import DataLoader from 'dataloader';

import { handTable } from '@/db/hand.table';

import type { DB, HandRecord } from '@/db';

const handById = (db: DB) => {
    return new DataLoader<string, HandRecord | null>(async (handIds) => {
        const records = await Promise.all(handIds.map((id) => handTable(db).getHandById(id)));
        const cache = new Map<string, HandRecord>();
        for (const record of records) {
            if (record) {
                cache.set(record.id, record);
            }
        }
        return handIds.map((id) => cache.get(id) ?? null);
    });
};

export default handById;
