import { describe, expect, it } from 'bun:test';

import { ParticipantKind } from '@/models/participationMetadata.model';

describe('ParticipantKind', () => {
    it('exposes expected enum values', () => {
        expect(ParticipantKind.USER).toBe(0);
        expect(ParticipantKind.SAVED_PLAYER).toBe(1);
        expect(ParticipantKind.ANONYMOUS_PARTICIPANT).toBe(2);
    });

    it('includes both numeric and string mappings', () => {
        expect(ParticipantKind[ParticipantKind.USER]).toBe('USER');
        expect(ParticipantKind[ParticipantKind.SAVED_PLAYER]).toBe('SAVED_PLAYER');
        expect(ParticipantKind[ParticipantKind.ANONYMOUS_PARTICIPANT]).toBe('ANONYMOUS_PARTICIPANT');
    });
});
