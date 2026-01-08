import DataLoader from 'dataloader';

import { handTable } from '@/db/hand.table';

import type { DB, HandRecord } from '@/db';

const handById = (db: DB): DataLoader<string, HandRecord | null> => {
    return new DataLoader<string, HandRecord | null>(async (ids) => {
        const records = await handTable(db).listHandsForIds([...ids]);
        const recordMap = new Map<string, HandRecord>();

        for (const record of records) {
            recordMap.set(record.id, record);
        }

        return ids.map((id) => recordMap.get(id) ?? null);
    });
};

export default handById;
