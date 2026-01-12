import DataLoader from 'dataloader';

import { handTable } from '@/db/hand.table';

import type { DB, HandRecord } from '@/db';

const handById = (db: DB) => {
    return new DataLoader<string, HandRecord | null>(async (handIds) => {
        const records = await handTable(db).listHandsForIds([...handIds]);
        const cache = new Map<string, HandRecord>();
        for (const record of records) {
            cache.set(record.id, record);
        }
        return handIds.map((id) => cache.get(id) ?? null);
    });
};

export default handById;
