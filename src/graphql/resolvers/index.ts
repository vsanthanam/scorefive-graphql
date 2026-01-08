import query from '@/graphql/resolvers/query.resolver';
import dateTime from '@/graphql/scalars/dateTime.scalar';

import type { Resolvers } from '@/__generated__/graphql';

const resolvers: Resolvers = {
    DateTime: dateTime,
    Query: query,
};

export default resolvers;
