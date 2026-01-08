import DataLoader from 'dataloader';

import { gameRepo } from '@/db/game.repo';

import type { DB, GameRecord } from '@/db';

const gamesForOwnerId = (db: DB): DataLoader<string, GameRecord[]> => {
    return new DataLoader<string, GameRecord[]>(async (ownerIds) => {
        const records = await gameRepo(db).listGamesForOwnerIds([...ownerIds]);
        const cache = new Map<string, GameRecord[]>();

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

export default gamesForOwnerId;
