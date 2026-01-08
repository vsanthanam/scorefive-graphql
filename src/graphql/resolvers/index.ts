import anonymousParticipant from '@/graphql/resolvers/anonymousParticipant.resolver';
import game from '@/graphql/resolvers/game.resolver';
import handScore from '@/graphql/resolvers/handScore.resolver';
import mutation from '@/graphql/resolvers/mutation.resolver';
import query from '@/graphql/resolvers/query.resolver';
import savedPlayer from '@/graphql/resolvers/savedPlayer.resolver';
import user from '@/graphql/resolvers/user.resolver';
import dateTime from '@/graphql/scalars/dateTime.scalar';

import type { Resolvers } from '@/__generated__/graphql';

const resolvers: Resolvers = {
    DateTime: dateTime,
    Query: query,
    Mutation: mutation,
    SavedPlayer: savedPlayer,
    Game: game,
    User: user,
    AnonymousParticipant: anonymousParticipant,
    HandScore: handScore,
};

export default resolvers;
