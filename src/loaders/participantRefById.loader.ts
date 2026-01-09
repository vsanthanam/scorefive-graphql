import DataLoader from 'dataloader';

import { participantRefTable } from '@/db/participantRef.table';

import type { ParticipantRefRecord, DB } from '@/db';

export const participantRefById = (db: DB) => {
    return new DataLoader<string, ParticipantRefRecord | null>(async (ids) => {
        const records = await participantRefTable(db).listParticipantRefsByIds([...ids]);
        const cache = new Map<string, ParticipantRefRecord>();
        for (const record of records) {
            cache.set(record.id, record);
        }
        return ids.map((id) => cache.get(id) ?? null);
    });
};

export default participantRefById;
