import gameById from '@/data/loaders/gameById.loader';
import gamesForOwnerId from '@/data/loaders/gamesForOwnerId.loader';
import participantRefById from '@/data/loaders/participantRefById.loader';
import participantRefsForGameId from '@/data/loaders/participantRefsForGameId.loader';
import participantRefsForSavedPlayerId from '@/data/loaders/participantRefsForSavedPlayerId.loaders';
import participantRefsForUserId from '@/data/loaders/participantRefsForUserId.loader';
import savedPlayerById from '@/data/loaders/savedPlayerById.loader';
import savedPlayersForOwnerId from '@/data/loaders/savedPlayersForOwnerId.loader';
import userById from '@/data/loaders/userById.loader';

import type { DB, SavedPlayerRecord, UserRecord, GameRecord, ParticipantRefRecord } from '@/db';
import type DataLoader from 'dataloader';

export type Loaders = {
    userById: DataLoader<string, UserRecord | null>;
    savedPlayerById: DataLoader<string, SavedPlayerRecord | null>;
    savedPlayersForOwnerId: DataLoader<string, SavedPlayerRecord[]>;
    gameById: DataLoader<string, GameRecord | null>;
    gamesForOwnerId: DataLoader<string, GameRecord[]>;
    participantRefById: DataLoader<string, ParticipantRefRecord | null>;
    participantRefsForGameId: DataLoader<string, ParticipantRefRecord[]>;
    participantRefsForUserId: DataLoader<string, ParticipantRefRecord[]>;
    participantRefsForSavedPlayerId: DataLoader<string, ParticipantRefRecord[]>;
};

export const createLoaders = (db: DB): Loaders => {
    return {
        savedPlayerById: savedPlayerById(db),
        savedPlayersForOwnerId: savedPlayersForOwnerId(db),
        userById: userById(db),
        gameById: gameById(db),
        gamesForOwnerId: gamesForOwnerId(db),
        participantRefById: participantRefById(db),
        participantRefsForGameId: participantRefsForGameId(db),
        participantRefsForUserId: participantRefsForUserId(db),
        participantRefsForSavedPlayerId: participantRefsForSavedPlayerId(db),
    };
};
