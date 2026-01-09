import DataLoader from 'dataloader';

import { participantRefTable } from '@/db/participantRef.table';

import type { DB, ParticipantRefRecord } from '@/db';

const participantRefByReferenceId = (db: DB): DataLoader<{ referenceId: string; gameId: string }, ParticipantRefRecord | null, string> => {
    return new DataLoader<{ referenceId: string; gameId: string }, ParticipantRefRecord | null, string>(
        async (keys) => {
            const referenceIdsByGameId = new Map<string, Set<string>>();
            for (const key of keys) {
                const referenceIds = referenceIdsByGameId.get(key.gameId) ?? new Set<string>();
                referenceIds.add(key.referenceId);
                referenceIdsByGameId.set(key.gameId, referenceIds);
            }

            const cache = new Map<string, ParticipantRefRecord>();
            await Promise.all(
                [...referenceIdsByGameId.entries()].map(async ([gameId, referenceIds]) => {
                    const records = await participantRefTable(db).listParticipantsByReferenceIds([...referenceIds], gameId);
                    for (const record of records) {
                        const compositeKey = `${record.referenceId}::${record.gameId}`;
                        cache.set(compositeKey, record);
                    }
                }),
            );

            return keys.map((key) => {
                const compositeKey = `${key.referenceId}::${key.gameId}`;
                return cache.get(compositeKey) ?? null;
            });
        },
        {
            cacheKeyFn: (key) => `${key.referenceId}::${key.gameId}`,
        },
    );
};

export default participantRefByReferenceId;
