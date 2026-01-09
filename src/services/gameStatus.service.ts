import { GameStatus } from '@/__generated__/graphql';

import { gameParticipantService } from './gameParticipant.services';

import type { GraphQLContext } from '@/graphql';
import type { Game } from '@/models/game.model';

export const gameStatusService = (context: GraphQLContext) => {
    return {
        async gameStatusForGame(game: Game): Promise<GameStatus> {
            const activeParticipants = await gameParticipantService(context).activeParticipantsForGame(game);
            if (activeParticipants.length < 2) {
                return GameStatus.Completed;
            } else {
                return GameStatus.InProgress;
            }
        },
    };
};
