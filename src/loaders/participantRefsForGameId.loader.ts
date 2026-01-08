import DataLoader from 'dataloader';

import { participantRefTable } from '@/db/participantRef.table';

import type { DB, ParticipantRefRecord } from '@/db';

const participantRefsForGameId = (db: DB): DataLoader<string, ParticipantRefRecord[]> => {
    return new DataLoader<string, ParticipantRefRecord[]>(async (gameIds) => {
        const records = await participantRefTable(db).listParticipantRefsForGameIds([...gameIds]);
        const cache = new Map<string, ParticipantRefRecord[]>();

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

export default participantRefsForGameId;
