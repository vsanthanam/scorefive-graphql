import type { GameParticipant } from '@/models/gameParticipant.model';

export type HandScore = {
    __typename: 'HandScore';
    participant: GameParticipant;
    points: number;
    handId: string;
};
