import { gameRepo } from '@/db/game.repo';
import { participantRefRepo } from '@/db/participantRef.repo';
import { userService } from '@/services/user.service';

import type { CreateGameInput } from '@/__generated__/graphql';
import type { GraphQLContext } from '@/graphql';
import type { AnonymousParticipant } from '@/models/anonymousParticipant.model';
import type { Game } from '@/models/game.model';
import type { SavedPlayer } from '@/models/savedPlayer.model';
import type { User } from '@/models/user.model';

export const gameService = (context: GraphQLContext) => {
    return {
        async createGameForViewer(input: CreateGameInput): Promise<Game> {
            const viewer = await userService(context).viewer();
            return await this.createGame(input, viewer);
        },
        async createGame(input: CreateGameInput, owner: User): Promise<Game> {
            if (input.scoreLimit <= 50) {
                throw new Error('Score limit must be greater than 50');
            }
            if (input.participants.length < 2) {
                throw new Error('At least two participants are required to create a game');
            }
            const id = await context.db.$transaction(async (tx) => {
                const gameRecord = await gameRepo(tx).createGame(owner.id, input.scoreLimit);
                for (let i = 0; i < input.participants.length; i++) {
                    const participant = input.participants[i];
                    if (!participant) {
                        throw new Error(`Participant at index ${i} is null or undefined`);
                    }
                    if (participant.userId) {
                        await participantRefRepo(tx).createUserParticipantRef(participant.userId, gameRecord.id, i);
                    } else if (participant.savedPlayerId) {
                        await participantRefRepo(tx).createSavedPlayerParticipantRef(participant.savedPlayerId, gameRecord.id, i);
                    } else if (participant.anonymousDisplayName) {
                        if (participant.anonymousDisplayName.trim() === '') {
                            throw new Error(`Anonymous participant at index ${i} must have a non-empty display name`);
                        }
                        await participantRefRepo(tx).createAnonymousParticipantRef(participant.anonymousDisplayName, gameRecord.id, i);
                    } else {
                        throw new Error(`Participant at index ${i} must have either userId, savedPlayerId, or anonymousDisplayName`);
                    }
                }
                return gameRecord.id;
            });
            const game = await this.gameById(id);
            if (!game) {
                throw new Error('Game not found after creation');
            }
            return game;
        },
        async viewerGames(): Promise<Game[]> {
            const viewer = await userService(context).viewer();
            return this.gamesForOwner(viewer);
        },
        async gamesForOwner(user: User): Promise<Game[]> {
            const records = await context.loaders.gamesForOwnerId.load(user.id);
            return Promise.all(
                records.map(async (record) => {
                    const owner = await userService(context).userById(record.ownerId);
                    if (!owner) {
                        throw new Error('Owner not found');
                    }
                    return {
                        __typename: 'Game',
                        id: record.id,
                        owner,
                        scoreLimit: record.scoreLimit,
                        createdAt: record.createdAt,
                        updatedAt: record.updatedAt,
                    };
                }),
            );
        },
        async gameById(gameId: string): Promise<Game> {
            const record = await context.loaders.gameById.load(gameId);
            if (!record) {
                throw new Error(`Game with ID ${gameId} not found`);
            }
            const owner = await userService(context).userById(record.ownerId);
            if (!owner) {
                throw new Error('Owner not found');
            }
            return {
                __typename: 'Game',
                id: record.id,
                owner,
                scoreLimit: record.scoreLimit,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
            };
        },
        async participatingGamesForUser(user: User): Promise<Game[]> {
            const refs = await context.loaders.participantRefsForUserId.load(user.id);
            return await Promise.all(
                refs.map(async (ref) => {
                    return await this.gameById(ref.gameId);
                }),
            );
        },
        async participatingGamesForSavedPlayer(savedPlayer: SavedPlayer): Promise<Game[]> {
            const refs = await context.loaders.participantRefsForSavedPlayerId.load(savedPlayer.id);
            return await Promise.all(
                refs.map(async (ref) => {
                    return await this.gameById(ref.gameId);
                }),
            );
        },
        async participatingGameForAnonymousParticipant(anonymousParticipant: AnonymousParticipant): Promise<Game> {
            const ref = await context.loaders.participantRefById.load(anonymousParticipant.id);
            if (!ref) {
                throw new Error('Participant reference not found');
            }
            return await this.gameById(ref.gameId);
        },
    };
};
