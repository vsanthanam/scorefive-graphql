-- DropForeignKey
ALTER TABLE "AnonymousParticipant" DROP CONSTRAINT "AnonymousParticipant_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Hand" DROP CONSTRAINT "Hand_gameId_fkey";

-- DropForeignKey
ALTER TABLE "ParticipantRef" DROP CONSTRAINT "ParticipantRef_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_handId_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_participantRefId_gameId_fkey";

-- AddForeignKey
ALTER TABLE "ParticipantRef" ADD CONSTRAINT "ParticipantRef_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnonymousParticipant" ADD CONSTRAINT "AnonymousParticipant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hand" ADD CONSTRAINT "Hand_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_handId_gameId_fkey" FOREIGN KEY ("handId", "gameId") REFERENCES "Hand"("id", "gameId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_participantRefId_gameId_fkey" FOREIGN KEY ("participantRefId", "gameId") REFERENCES "ParticipantRef"("id", "gameId") ON DELETE CASCADE ON UPDATE CASCADE;
