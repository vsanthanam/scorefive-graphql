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
