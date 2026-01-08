import DataLoader from 'dataloader';

import { savedPlayerRepo } from '@/db/savedPlayer.repo';

import type { DB, SavedPlayerRecord } from '@/db';

const savedPlayerById = (db: DB): DataLoader<string, SavedPlayerRecord | null> => {
    return new DataLoader<string, SavedPlayerRecord | null>(async (savedPlayerIds) => {
        const records = await savedPlayerRepo(db).listSavedPlayersForIds([...savedPlayerIds]);
        const cache = new Map(records.map((record) => [record.id, record]));

        return savedPlayerIds.map((id) => cache.get(id) ?? null);
    });
};

export default savedPlayerById;
