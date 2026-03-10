import type { GameParticipant } from '@/models/gameParticipant.model';
import type { Hand } from '@/models/hand.model';

export type HandStatistics = {
    __typename: 'HandStatistics';
    hand: Hand;
    winners: GameParticipant[];
    losers: GameParticipant[];
    averageScore: number;
    averageNonZeroScore: number;
};
