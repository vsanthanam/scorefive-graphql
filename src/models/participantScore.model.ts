import type { Game } from '@/models/game.model';
import type { GameParticipant } from '@/models/gameParticipant.model';

export type ParticipantScore = {
    __typename: 'ParticipantScore';
    game: Game;
    participant: GameParticipant;
    totalPoints: number;
};
