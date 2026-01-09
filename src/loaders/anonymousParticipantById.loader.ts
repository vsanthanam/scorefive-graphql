import DataLoader from 'dataloader';

import { anonymousParticipantTable } from '@/db/anonymousParticipant.table';

import type { DB, AnonymousParticipantRecord } from '@/db';

const anonymousParticipantById = (db: DB) => {
    return new DataLoader<string, AnonymousParticipantRecord | null>(async (anonymousParticipantIds) => {
        const records = await anonymousParticipantTable(db).listAnonymousParticipantsByIds([...anonymousParticipantIds]);
        const cache = new Map<string, AnonymousParticipantRecord>();
        for (const record of records) {
            cache.set(record.id, record);
        }
        return anonymousParticipantIds.map((id) => cache.get(id) ?? null);
    });
};

export default anonymousParticipantById;
