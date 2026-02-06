import { describe, expect, it } from 'bun:test';

import { ParticipantKind } from '@/models/participationMetadata.model';
import { buildSavedPlayer } from '@/models/savedPlayer.model';

import type { SavedPlayerRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { User } from '@/models/user.model';

describe('buildSavedPlayer', () => {
    it('builds a saved player and loads the owner', async () => {
        const owner: User = {
            __typename: 'User',
            id: 'user-1',
            displayName: 'Owner Name',
            emailAddress: 'owner@example.test',
            emailVerified: true,
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-02T00:00:00.000Z'),
            participationMetadata: [],
        };

        const calls: string[] = [];
        const context = {
            services: {
                user: {
                    userById: async (id: string) => {
                        calls.push(id);
                        return owner;
                    },
                },
            },
        } as unknown as GraphQLContext;

        const record = {
            id: 'saved-1',
            displayName: 'Saved Player',
            ownerId: 'user-1',
            participantRefs: [
                { id: 'ref-1', gameId: 'game-1', turnOrder: 2 },
                { id: 'ref-2', gameId: 'game-2', turnOrder: 1 },
            ],
        } as unknown as SavedPlayerRecord;

        const result = await buildSavedPlayer(record, context);

        expect(calls).toEqual(['user-1']);
        expect(result).toEqual({
            __typename: 'SavedPlayer',
            id: 'saved-1',
            displayName: 'Saved Player',
            owner,
            participationMetadata: [
                {
                    id: 'ref-1',
                    gameId: 'game-1',
                    kind: ParticipantKind.SAVED_PLAYER,
                    turnOrder: 2,
                },
                {
                    id: 'ref-2',
                    gameId: 'game-2',
                    kind: ParticipantKind.SAVED_PLAYER,
                    turnOrder: 1,
                },
            ],
        });
    });

    it('returns empty participation metadata when no refs exist', async () => {
        const owner: User = {
            __typename: 'User',
            id: 'user-2',
            displayName: 'Owner Two',
            emailVerified: false,
            createdAt: new Date('2024-01-03T00:00:00.000Z'),
            updatedAt: new Date('2024-01-03T00:00:00.000Z'),
            participationMetadata: [],
        };

        const calls: string[] = [];
        const context = {
            services: {
                user: {
                    userById: async (id: string) => {
                        calls.push(id);
                        return owner;
                    },
                },
            },
        } as unknown as GraphQLContext;

        const record = {
            id: 'saved-2',
            displayName: 'Empty Player',
            ownerId: 'user-2',
            participantRefs: [],
        } as unknown as SavedPlayerRecord;

        const result = await buildSavedPlayer(record, context);

        expect(calls).toEqual(['user-2']);
        expect(result.participationMetadata).toEqual([]);
        expect(result.owner).toBe(owner);
    });
});
