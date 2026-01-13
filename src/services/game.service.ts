import { GameStatus, type CreateGameInput } from '@/__generated__/graphql';
import { anonymousParticipantTable } from '@/db/anonymousParticipant.table';
import { gameTable } from '@/db/game.table';
import { participantRefTable } from '@/db/participantRef.table';

import type { GameRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { AnonymousParticipant } from '@/models/anonymousParticipant.model';
import type { Game } from '@/models/game.model';
import type { SavedPlayer } from '@/models/savedPlayer.model';
import type { User } from '@/models/user.model';

export class GameService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async gameById(id: string): Promise<Game> {
        const record = await this.context.loaders.gameById.load(id);
        if (!record) {
            throw new Error(`Game with ID ${id} not found`);
        }
        return this.buildGame(record);
    }

    async gamesForViewer(): Promise<Game[]> {
        const user = await this.context.services.user.viewer();
        return this.gamesForOwner(user);
    }

    async gamesForOwner(owner: User): Promise<Game[]> {
        const games = await this.context.loaders.gamesForOwnerId.load(owner.id);
        return await Promise.all(games.map((record) => this.buildGame(record)));
    }

    async createGameForViewer(input: CreateGameInput): Promise<Game> {
        const user = await this.context.services.user.viewer();
        return this.createGameForOwner(user, input);
    }

    async createGameForOwner(owner: User, input: CreateGameInput): Promise<Game> {
        if (input.gameParticipants.length < 2) {
            throw new Error('A game must have at least two participants');
        }
        if (input.scoreLimit <= 50) {
            throw new Error('Score limit must be greater than 50');
        }
        const id = await this.context.db.$transaction(async (tx) => {
            const newGame = await gameTable(tx).createGame(owner.id, input.scoreLimit);
            for (let i = 0; i < input.gameParticipants.length; i++) {
                const participantInput = input.gameParticipants[i];
                if (!participantInput) {
                    throw new Error('Invalid participant input');
                }
                if (participantInput.userId) {
                    await this.context.services.user.userById(participantInput.userId);
                    await participantRefTable(tx).createUserParticipantRef(newGame.id, participantInput.userId, i);
                } else if (participantInput.savedPlayerId) {
                    await this.context.services.savedPlayer.savedPlayerById(participantInput.savedPlayerId);
                    await participantRefTable(tx).createSavedPlayerParticipantRef(newGame.id, participantInput.savedPlayerId, i);
                } else if (participantInput.anonymousParticipantDisplayName) {
                    const anonymousParticipant = await anonymousParticipantTable(tx).createAnonymousParticipant(
                        newGame.id,
                        participantInput.anonymousParticipantDisplayName,
                    );
                    await participantRefTable(tx).createAnonymousParticipantRef(newGame.id, anonymousParticipant.id, i);
                } else {
                    throw new Error('Unknown participant type in input');
                }
            }
            return newGame.id;
        });
        return this.gameById(id);
    }

    async participatingGamesForUser(user: User): Promise<Game[]> {
        return await Promise.all(
            user.participationMetadata.map(async (pm) => {
                return this.gameById(pm.gameId);
            }),
        );
    }

    async activeParticipatingGamesForUser(user: User): Promise<Game[]> {
        const games = await this.participatingGamesForUser(user);
        const gamesAndStatus = await Promise.all(
            games.map(async (game) => {
                const status = await this.context.services.gameStatus.gameStatusForGame(game);
                const isActive = status === GameStatus.Completed;
                return { game, isActive };
            }),
        );
        return gamesAndStatus.filter((gs) => gs.isActive).map((gs) => gs.game);
    }

    async participatingGamesForSavedPlayer(savedPlayer: SavedPlayer): Promise<Game[]> {
        return await Promise.all(
            savedPlayer.participationMetadata.map(async (pm) => {
                return this.gameById(pm.gameId);
            }),
        );
    }

    async activeParticipatingGamesForSavedPlayer(savedPlayer: SavedPlayer): Promise<Game[]> {
        const games = await this.participatingGamesForSavedPlayer(savedPlayer);
        const gamesAndStatus = await Promise.all(
            games.map(async (game) => {
                const status = await this.context.services.gameStatus.gameStatusForGame(game);
                const isActive = status === GameStatus.Completed;
                return { game, isActive };
            }),
        );
        return gamesAndStatus.filter((gs) => gs.isActive).map((gs) => gs.game);
    }

    async participatingGameForAnonymousParticipant(anonymousParticipant: AnonymousParticipant): Promise<Game> {
        return await this.gameById(anonymousParticipant.participationMetadata.gameId);
    }

    async activeParticipatingGameForAnonymousParticipant(anonymousParticipant: AnonymousParticipant): Promise<Game | null> {
        const game = await this.participatingGameForAnonymousParticipant(anonymousParticipant);
        const status = await this.context.services.gameStatus.gameStatusForGame(game);
        if (status === GameStatus.Completed) {
            return null;
        }
        return game;
    }

    async deleteGame(id: string): Promise<boolean> {
        try {
            await gameTable(this.context.db).deleteGame(id);
            return true;
        } catch {
            return false;
        }
    }

    async buildGame(record: GameRecord): Promise<Game> {
        const orderedParticipants = await Promise.all(
            record.participantRefs.map(async (ref) => {
                const refRecord = await this.context.loaders.participantRefById.load(ref.id);
                if (!refRecord) {
                    throw new Error(`ParticipantRef with ID ${ref.id} not found`);
                }
                return await this.context.services.gameParticipant.buildGameParticipant(refRecord);
            }),
        );
        const owner = await this.context.services.user.userById(record.owner.id);
        return {
            __typename: 'Game',
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            scoreLimit: record.scoreLimit,
            orderedParticipants,
            owner,
            id: record.id,
        };
    }

    private readonly context: GraphQLContext;
}
