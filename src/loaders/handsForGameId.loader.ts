import DataLoader from 'dataloader';

import { handTable } from '@/db/hand.table';

import type { HandRecord, DB } from '@/db';

const handsForGameId = (db: DB) => {
    return new DataLoader<string, HandRecord[]>(async (gameIds) => {
        const records = await handTable(db).listHandsForGameIds([...gameIds]);
        const cache = new Map<string, HandRecord[]>();
        for (const gameId of gameIds) {
            cache.set(gameId, []);
        }

        for (const record of records) {
            const bucket = cache.get(record.gameId);
            if (bucket) {
                bucket.push(record);
            } else {
                cache.set(record.gameId, [record]);
            }
        }

        return gameIds.map((gameId) => cache.get(gameId) ?? []);
    });
};

export default handsForGameId;
