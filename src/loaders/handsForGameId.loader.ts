import DataLoader from 'dataloader';

import { handTable } from '@/db/hand.table';

import type { HandRecord, DB } from '@/db';

const handsForGameId = (db: DB): DataLoader<string, HandRecord[]> => {
    return new DataLoader<string, HandRecord[]>(async (gameIds) => {
        const records = await handTable(db).listHandsForGameIds([...gameIds]);
        const cache = new Map<string, HandRecord[]>();

        for (const record of records) {
            const handsForGame = cache.get(record.gameId) ?? [];
            handsForGame.push(record);
            cache.set(record.gameId, handsForGame);
        }

        return gameIds.map((id) => cache.get(id) ?? []);
    });
};

export default handsForGameId;
