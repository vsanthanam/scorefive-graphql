import DataLoader from 'dataloader';

import { savedPlayerTable } from '@/db/savedPlayer.table';

import type { DB, SavedPlayerRecord } from '@/db';

const savedPlayersForOwnerId = (db: DB): DataLoader<string, SavedPlayerRecord[]> => {
    return new DataLoader<string, SavedPlayerRecord[]>(async (ownerIds) => {
        const records = await savedPlayerTable(db).listSavedPlayersForOwnerIds([...ownerIds]);
        const cache = new Map<string, SavedPlayerRecord[]>();

        for (const ownerId of ownerIds) {
            cache.set(ownerId, []);
        }

        for (const record of records) {
            const bucket = cache.get(record.ownerId);
            if (bucket) {
                bucket.push(record);
            } else {
                cache.set(record.ownerId, [record]);
            }
        }

        return ownerIds.map((ownerId) => cache.get(ownerId) ?? []);
    });
};

export default savedPlayersForOwnerId;
