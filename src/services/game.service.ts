import { anonymousParticipantTable } from '@/db/anonymousParticipant.table';
import { gameTable } from '@/db/game.table';
import { participantRefTable } from '@/db/participantRef.table';
import { type Game, buildGame } from '@/models/game.model';

import type { CreateGameInput } from '@/__generated__/graphql';
import type { GraphQLContext } from '@/graphql';
import type { AnonymousParticipant } from '@/models/anonymousParticipant.model';
import type { SavedPlayer } from '@/models/savedPlayer.model';
import type { User } from '@/models/user.model';

export class GameService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async gameById(id: string): Promise<Game> {
        const game = await this.context.loaders.gameById.load(id);
        if (!game) {
            throw new Error(`Game with ID ${id} not found`);
        }
        return buildGame(game, this.context);
    }

    async gamesForViewer(): Promise<Game[]> {
        const user = await this.context.services.user.viewer();
        return this.gamesForOwner(user);
    }

    async gamesForOwner(owner: User): Promise<Game[]> {
        const games = await this.context.loaders.gamesForOwnerId.load(owner.id);
        return await Promise.all(games.map((g) => buildGame(g, this.context)));
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

    async participatingGamesForSavedPlayer(savedPlayer: SavedPlayer): Promise<Game[]> {
        return await Promise.all(
            savedPlayer.participationMetadata.map(async (pm) => {
                return this.gameById(pm.gameId);
            }),
        );
    }

    async participatingGameForAnonymousParticipant(anonymousParticipant: AnonymousParticipant): Promise<Game> {
        return await this.gameById(anonymousParticipant.participationMetadata.gameId);
    }

    private readonly context: GraphQLContext;
}
