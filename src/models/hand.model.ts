import type { Game } from '@/models/game.model';
import type { HandScore } from '@/models/handScore.model';

export type Hand = {
    __typename: 'Hand';
    id: string;
    handNumber: number;
    scores: HandScore[];
    game: Game;
};
