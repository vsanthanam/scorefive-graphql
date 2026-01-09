import gameById from '@/loaders/gameById.loader';
import gamesForOwnerId from '@/loaders/gamesForOwnerId.loader';
import handById from '@/loaders/handById.loader';
import handsForGameId from '@/loaders/handsForGameId.loader';
import participantRefById from '@/loaders/participantRefById.loader';
import participantRefByReferenceId from '@/loaders/participantRefByReferenceId.loader';
import participantRefsForGameId from '@/loaders/participantRefsForGameId.loader';
import participantRefsForSavedPlayerId from '@/loaders/participantRefsForSavedPlayerId.loaders';
import participantRefsForUserId from '@/loaders/participantRefsForUserId.loader';
import savedPlayerById from '@/loaders/savedPlayerById.loader';
import savedPlayersForOwnerId from '@/loaders/savedPlayersForOwnerId.loader';
import userById from '@/loaders/userById.loader';

import type { DB, SavedPlayerRecord, UserRecord, GameRecord, ParticipantRefRecord, HandRecord } from '@/db';
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
    handsForGameId: DataLoader<string, HandRecord[]>;
    handById: DataLoader<string, HandRecord | null>;
    participantRefByReferenceId: DataLoader<{ referenceId: string; gameId: string }, ParticipantRefRecord | null, string>;
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
        handsForGameId: handsForGameId(db),
        handById: handById(db),
        participantRefByReferenceId: participantRefByReferenceId(db),
    };
};
