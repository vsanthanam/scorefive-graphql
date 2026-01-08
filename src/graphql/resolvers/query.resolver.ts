import { GraphQLError } from 'graphql';

import { userService } from '@/services/user.service';

import type { QueryResolvers } from '@/__generated__/graphql';

const query: QueryResolvers = {
    async me(_parent, _args, context) {
        try {
            return await userService(context).viewer();
        } catch (error) {
            throw new GraphQLError((error as Error).message);
        }
    },
};

export default query;
