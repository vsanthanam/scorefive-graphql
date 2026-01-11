-- Ensure a ParticipantRef points to exactly one participant kind.
ALTER TABLE "ParticipantRef"
ADD CONSTRAINT "ParticipantRef_exactly_one_ref_ck"
CHECK (num_nonnulls("userId", "savedPlayerId", "anonymousParticipantId") = 1);