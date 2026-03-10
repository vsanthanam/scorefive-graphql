import type { Hand } from '@/models/hand.model';
import type { HandStatistics } from '@/models/handStatistics.model';

export const validate = (scores: number[]) => {
    const zeroes = scores.filter((score) => score === 0).length;
    if (zeroes === scores.length) {
        throw new Error('At least one score must be greater than zero.');
    }
    if (zeroes === 0) {
        throw new Error('At least one score must be zero.');
    }
    for (const score of scores) {
        if (score < 0) {
            throw new Error('Scores cannot be negative.');
        }
        if (score > 50) {
            throw new Error('Scores cannot be greater than 50.');
        }
    }
};

export const assembleHandStatistics = (hand: Hand): HandStatistics => {
    const winners = hand.scores.filter((score) => score.points === 0).map((score) => score.participant);
    const highestScore = Math.max(...hand.scores.map((score) => score.points));
    const losers = hand.scores.filter((score) => score.points === highestScore).map((score) => score.participant);
    const averageScore = hand.scores.reduce((sum, score) => sum + score.points, 0) / hand.scores.length;
    const averageNonZeroScore =
        hand.scores.filter((score) => score.points > 0).reduce((sum, score) => sum + score.points, 0) /
        hand.scores.filter((score) => score.points > 0).length;
    return {
        __typename: 'HandStatistics',
        hand: hand,
        winners,
        losers,
        averageScore,
        averageNonZeroScore,
    };
};
