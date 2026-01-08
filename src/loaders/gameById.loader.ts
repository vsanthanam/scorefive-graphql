import DataLoader from 'dataloader';

import { gameTable } from '@/db/game.table';

import type { DB, GameRecord } from '@/db';

const gameById = (db: DB): DataLoader<string, GameRecord | null> => {
    return new DataLoader<string, GameRecord | null>(async (gameIds) => {
        const records = await gameTable(db).listGamesForIds([...gameIds]);
        const cache = new Map(records.map((record) => [record.id, record]));

        return gameIds.map((id) => cache.get(id) ?? null);
    });
};

export default gameById;
