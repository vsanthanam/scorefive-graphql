import DataLoader from 'dataloader';

import { savedPlayerTable } from '@/db/savedPlayer.table';

import type { DB, SavedPlayerRecord } from '@/db';

const savedPlayerById = (db: DB) => {
    return new DataLoader<string, SavedPlayerRecord | null>(async (savedPlayerIds) => {
        const records = await savedPlayerTable(db).listSavedPlayersForIds([...savedPlayerIds]);
        const cache = new Map<string, SavedPlayerRecord>();
        for (const record of records) {
            cache.set(record.id, record);
        }
        return savedPlayerIds.map((id) => cache.get(id) ?? null);
    });
};

export default savedPlayerById;
