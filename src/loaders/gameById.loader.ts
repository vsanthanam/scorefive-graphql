import DataLoader from 'dataloader';

import { gameTable } from '@/db/game.table';

import type { DB, GameRecord } from '@/db';

const gameById = (db: DB) => {
    return new DataLoader<string, GameRecord | null>(async (gameIds) => {
        const records = gameTable(db).listGamesByIds([...gameIds]);
        const cache = new Map<string, GameRecord>();
        for (const record of await records) {
            cache.set(record.id, record);
        }
        return gameIds.map((id) => cache.get(id) ?? null);
    });
};

export default gameById;
