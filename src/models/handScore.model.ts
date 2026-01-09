import type { GameParticipant } from '@/models/gameParticipant.model';

export type HandScore = {
    participant: GameParticipant;
    points: number;
    handId: string;
};
