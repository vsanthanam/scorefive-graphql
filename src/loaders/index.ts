import anonymousParticipantById from '@/loaders/anonymousParticipantById.loader';
import gameById from '@/loaders/gameById.loader';
import gamesForOwnerId from '@/loaders/gamesForOwnerId.loader';
import handById from '@/loaders/handById.loader';
import handsForGameId from '@/loaders/handsForGameId.loader';
import participantRefById from '@/loaders/participantRefById.loader';
import savedPlayerById from '@/loaders/savedPlayerById.loader';
import savedPlayersForOwnerId from '@/loaders/savedPlayersForOwnerId.loader';
import userById from '@/loaders/userById.loader';

import type { DB, UserRecord, SavedPlayerRecord, AnonymousParticipantRecord, GameRecord, ParticipantRefRecord, HandRecord } from '@/db';
import type DataLoader from 'dataloader';

export type Loaders = {
    userById: DataLoader<string, UserRecord | null>;
    savedPlayerById: DataLoader<string, SavedPlayerRecord | null>;
    savedPlayersForOwnerId: DataLoader<string, SavedPlayerRecord[]>;
    anonymousParticipantById: DataLoader<string, AnonymousParticipantRecord | null>;
    gameById: DataLoader<string, GameRecord | null>;
    participantRefById: DataLoader<string, ParticipantRefRecord | null>;
    gamesForOwnerId: DataLoader<string, GameRecord[]>;
    handById: DataLoader<string, HandRecord | null>;
    handsForGameId: DataLoader<string, HandRecord[]>;
};

export const createLoaders = (db: DB): Loaders => {
    return {
        userById: userById(db),
        savedPlayerById: savedPlayerById(db),
        savedPlayersForOwnerId: savedPlayersForOwnerId(db),
        anonymousParticipantById: anonymousParticipantById(db),
        gameById: gameById(db),
        participantRefById: participantRefById(db),
        gamesForOwnerId: gamesForOwnerId(db),
        handById: handById(db),
        handsForGameId: handsForGameId(db),
    };
};
