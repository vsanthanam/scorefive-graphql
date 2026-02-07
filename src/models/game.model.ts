import type { GameParticipant } from './gameParticipant.model';
import type { User } from '@/models/user.model';

export type Game = {
    __typename: 'Game';
    id: string;
    createdAt: Date;
    updatedAt: Date;
    scoreLimit: number;
    orderedParticipants: GameParticipant[];
    owner: User;
    name: string | null;
};
