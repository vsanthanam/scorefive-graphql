import type { GraphQLContext } from '@/graphql';
import type { User } from '@/models/user.model';

export const userService = (context: GraphQLContext) => {
    return {
        async viewer(): Promise<User> {
            if (!context.userId) {
                throw new Error('Unauthorized');
            }
            const user = await context.loaders.userById.load(context.userId);
            if (!user) {
                throw new Error('User not found');
            }
            return {
                __typename: 'User',
                id: user.id,
                displayName: user.displayName,
                emailAddress: user.emailAddress,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        },
        async userById(userId: string): Promise<User | null> {
            const user = await context.loaders.userById.load(userId);
            if (!user) {
                return null;
            }
            return {
                __typename: 'User',
                id: user.id,
                displayName: user.displayName,
                emailAddress: user.emailAddress,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        },
    };
};
