import type { ParticipantRefRecord } from '@/db';
import type { GraphQLContext } from '@/graphql';
import type { Game } from '@/models/game.model';
import type { GameParticipant } from '@/models/gameParticipant.model';

export class GameParticipantService {
    constructor(context: GraphQLContext) {
        this.context = context;
    }

    async activeParticipantsForGame(game: Game): Promise<GameParticipant[]> {
        const participantScores = await this.context.services.participantScore.participantScoresForGame(game);
        return participantScores.filter((ps) => ps.totalPoints < game.scoreLimit).map((ps) => ps.participant);
    }

    async winnerForGame(game: Game): Promise<GameParticipant> {
        const participants = await this.activeParticipantsForGame(game);
        if (participants.length > 1) {
            throw new Error('Game is still in progress, no winner yet');
        }
        const winner = participants[0];
        if (!winner) {
            throw new Error('No participants found for the game');
        }
        return winner;
    }

    async buildGameParticipant(record: ParticipantRefRecord): Promise<GameParticipant> {
        if (record.user) {
            return await this.context.services.user.userById(record.user.id);
        } else if (record.savedPlayer) {
            return await this.context.services.savedPlayer.savedPlayerById(record.savedPlayer.id);
        } else if (record.anonymousParticipant) {
            return await this.context.services.anonymousParticipant.anonymousParticipantById(record.anonymousParticipant.id);
        } else {
            throw new Error('Unknown participant type');
        }
    }

    private readonly context: GraphQLContext;
}
