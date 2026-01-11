import { AnonymousParticipantService } from '@/services/anonymousParticipant.service';
import { GameService } from '@/services/game.service';
import { HandService } from '@/services/hand.service';
import { SavedPlayerService } from '@/services/savedPlayer.service';
import { UserService } from '@/services/user.service';

import type { GraphQLContext } from '@/graphql';

export type Services = {
    user: UserService;
    savedPlayer: SavedPlayerService;
    anonymousParticipant: AnonymousParticipantService;
    game: GameService;
    hand: HandService;
};

export const createServices = (getContext: () => GraphQLContext): Services => {
    return {
        get user() {
            return new UserService(getContext());
        },
        get savedPlayer() {
            return new SavedPlayerService(getContext());
        },
        get anonymousParticipant() {
            return new AnonymousParticipantService(getContext());
        },
        get game() {
            return new GameService(getContext());
        },
        get hand() {
            return new HandService(getContext());
        },
    };
};
