import type { HandScore } from '@/models/handScore.model';

export type Hand = {
    __typename: 'Hand';
    id: string;
    scores: HandScore[];
    gameId: string;
    handNumber: number;
};
