import userById from '@/data/loaders/userById.loader';

import type { DB, UserRecord } from '@/db';
import type DataLoader from 'dataloader';

export type Loaders = {
    userById: DataLoader<string, UserRecord | null>;
};

export const createLoaders = (db: DB): Loaders => {
    return {
        userById: userById(db),
    };
};
