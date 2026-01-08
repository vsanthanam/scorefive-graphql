import type { User } from './user.model';

export type Game = {
    __typename: 'Game';
    owner: User;
    id: string;
    scoreLimit: number;
    createdAt: Date;
    updatedAt: Date;
};
