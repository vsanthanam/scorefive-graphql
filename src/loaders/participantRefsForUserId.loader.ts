import DataLoader from 'dataloader';

import { participantRefTable } from '@/db/participantRef.table';

import type { DB, ParticipantRefRecord } from '@/db';

const participantRefsForUserId = (db: DB): DataLoader<string, ParticipantRefRecord[]> => {
    return new DataLoader<string, ParticipantRefRecord[]>(async (userIds) => {
        const records = await participantRefTable(db).listParticipantRefsForUserIds([...userIds]);
        const cache = new Map<string, ParticipantRefRecord[]>();

        for (const record of records) {
            const refsForUser = cache.get(record.referenceId!) ?? [];
            refsForUser.push(record);
            cache.set(record.referenceId!, refsForUser);
        }

        return userIds.map((id) => cache.get(id) ?? []);
    });
};

export default participantRefsForUserId;
