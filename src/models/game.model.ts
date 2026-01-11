import { buildGameParticipant, type GameParticipant } from './gameParticipant.model';

import type { GameRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { User } from '@/models/user.model';

export type Game = {
    __typename: 'Game';
    id: string;
    createdAt: Date;
    updatedAt: Date;
    scoreLimit: number;
    orderedParticipants: GameParticipant[];
    owner: User;
};

export const buildGame = async (record: GameRecord, context: GraphQLContext): Promise<Game> => {
    const orderedParticipants = await Promise.all(
        record.participantRefs.map(async (ref) => {
            const refRecord = await context.loaders.participantRefById.load(ref.id);
            if (!refRecord) {
                throw new Error(`ParticipantRef with ID ${ref.id} not found`);
            }
            return await buildGameParticipant(refRecord, context);
        }),
    );
    const owner = await context.services.user.userById(record.owner.id);
    return {
        __typename: 'Game',
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        scoreLimit: record.scoreLimit,
        orderedParticipants,
        owner,
        id: record.id,
    };
};
