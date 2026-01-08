import DataLoader from 'dataloader';

import { participantRefTable } from '@/db/participantRef.table';

import type { DB, ParticipantRefRecord } from '@/db';

const participantRefById = (db: DB): DataLoader<string, ParticipantRefRecord | null> => {
    return new DataLoader<string, ParticipantRefRecord | null>(async (participantRefIds) => {
        const records = await participantRefTable(db).listParticipantRefsForIds([...participantRefIds]);
        const cache = new Map(records.map((record) => [record.id, record]));

        return participantRefIds.map((id) => cache.get(id) ?? null);
    });
};

export default participantRefById;
