import type { GameParticipant } from '@/models/gameParticipant.model';

export type HandScore = {
    __typename: 'HandScore';
    id: string;
    points: number;
    participant: GameParticipant;
    handId: string;
};
