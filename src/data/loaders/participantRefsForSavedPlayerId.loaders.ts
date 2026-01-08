import DataLoader from 'dataloader';

import { participantRefRepo } from '@/data/repositories/participantRef.repo';

import type { DB, ParticipantRefRecord } from '@/db';

const participantRefsForSavedPlayerId = (db: DB): DataLoader<string, ParticipantRefRecord[]> => {
    return new DataLoader<string, ParticipantRefRecord[]>(async (savedPlayerIds) => {
        const records = await participantRefRepo(db).listParticipantRefsForSavedPlayerIds([...savedPlayerIds]);
        const cache = new Map<string, ParticipantRefRecord[]>();
        for (const record of records) {
            const refsForSavedPlayer = cache.get(record.referenceId!) ?? [];
            refsForSavedPlayer.push(record);
            cache.set(record.referenceId!, refsForSavedPlayer);
        }

        return savedPlayerIds.map((id) => cache.get(id) ?? []);
    });
};

export default participantRefsForSavedPlayerId;
