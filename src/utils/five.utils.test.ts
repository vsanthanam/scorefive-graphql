import { describe, expect, it } from 'bun:test';

import { validate } from '@/utils/five.utils';

describe('validate', () => {
    it('throws when all scores are zero', () => {
        expect(() => validate([0, 0, 0])).toThrow('At least one score must be greater than zero.');
    });

    it('throws when no scores are zero', () => {
        expect(() => validate([1, 2, 3])).toThrow('At least one score must be zero.');
    });

    it('throws when a score is negative', () => {
        expect(() => validate([0, -1, 5])).toThrow('Scores cannot be negative.');
    });

    it('throws when a score is greater than 50', () => {
        expect(() => validate([0, 51, 5])).toThrow('Scores cannot be greater than 50.');
    });

    it('does not throw for valid scores', () => {
        expect(() => validate([0, 1, 50])).not.toThrow();
    });
});
