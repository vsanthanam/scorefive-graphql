import { gameParticipantService } from '@/services/gameParticipant.services';

import type { GameResolvers } from '@/__generated__/graphql';

const game: GameResolvers = {
    async orderedParticipants(parent, _args, context) {
        return await gameParticipantService(context).orderedParticipantsForGame(parent);
    },
};

export default game;
