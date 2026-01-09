import { type User, buildUser } from '@/models/user.model';

import type { GraphQLContext } from '@/graphql';

export class UserService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async viewer(): Promise<User> {
        if (!this.context.userId) {
            throw new Error('Unauthorized');
        }
        const user = await this.userById(this.context.userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async userById(userId: string): Promise<User> {
        const user = await this.context.loaders.userById.load(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        return buildUser(user);
    }

    private readonly context: GraphQLContext;
}
