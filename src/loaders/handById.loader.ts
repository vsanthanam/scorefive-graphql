import DataLoader from 'dataloader';

import { handRepo } from '@/db/hand.repo';

import type { DB, HandRecord } from '@/db';

const handById = (db: DB): DataLoader<string, HandRecord | null> => {
    return new DataLoader<string, HandRecord | null>(async (ids) => {
        const records = await handRepo(db).listHandsForIds([...ids]);
        const recordMap = new Map<string, HandRecord>();

        for (const record of records) {
            recordMap.set(record.id, record);
        }

        return ids.map((id) => recordMap.get(id) ?? null);
    });
};

export default handById;
