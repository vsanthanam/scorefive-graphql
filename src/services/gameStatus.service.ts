import { GameStatus } from '@/__generated__/graphql';

import type { GraphQLContext } from '@/graphql';
import type { Game } from '@/models/game.model';

export class GameStatusService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async gameStatusForGame(game: Game): Promise<GameStatus> {
        const activeParticipants = await this.context.services.gameParticipant.activeParticipantsForGame(game);
        if (activeParticipants.length > 1) {
            return GameStatus.InProgress;
        } else {
            return GameStatus.Completed;
        }
    }

    private readonly context: GraphQLContext;
}
