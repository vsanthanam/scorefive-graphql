import { ParticipantKind } from '@/models/participationMetadata.model';

import type { UserRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { User } from '@/models/user.model';

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
        return UserService.buildUser(user);
    }

    static buildUser(user: UserRecord): User {
        const participationMetadata = user.participantRefs.map((ref) => {
            return {
                id: ref.id,
                gameId: ref.gameId,
                kind: ParticipantKind.USER,
                turnOrder: ref.turnOrder,
            };
        });
        return {
            __typename: 'User',
            id: user.id,
            displayName: user.displayName,
            emailAddress: user.emailAddress,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            participationMetadata,
        };
    }

    private readonly context: GraphQLContext;
}
