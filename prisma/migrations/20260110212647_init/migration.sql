-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "displayName" TEXT NOT NULL,
    "emailAddress" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedPlayer" (
    "id" UUID NOT NULL,
    "displayName" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "SavedPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" UUID NOT NULL,
    "ownerId" TEXT NOT NULL,
    "scoreLimit" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantRef" (
    "id" UUID NOT NULL,
    "gameId" UUID NOT NULL,
    "userId" TEXT,
    "savedPlayerId" UUID,
    "anonymousParticipantId" UUID,
    "turnOrder" INTEGER NOT NULL,

    CONSTRAINT "ParticipantRef_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnonymousParticipant" (
    "id" UUID NOT NULL,
    "displayName" TEXT NOT NULL,
    "gameId" UUID NOT NULL,

    CONSTRAINT "AnonymousParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hand" (
    "id" UUID NOT NULL,
    "gameId" UUID NOT NULL,
    "handNumber" INTEGER NOT NULL,

    CONSTRAINT "Hand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" UUID NOT NULL,
    "handId" UUID NOT NULL,
    "participantRefId" UUID NOT NULL,
    "gameId" UUID NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantRef_anonymousParticipantId_key" ON "ParticipantRef"("anonymousParticipantId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantRef_id_gameId_key" ON "ParticipantRef"("id", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantRef_gameId_turnOrder_key" ON "ParticipantRef"("gameId", "turnOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantRef_gameId_userId_key" ON "ParticipantRef"("gameId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantRef_gameId_savedPlayerId_key" ON "ParticipantRef"("gameId", "savedPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantRef_gameId_anonymousParticipantId_key" ON "ParticipantRef"("gameId", "anonymousParticipantId");

-- CreateIndex
CREATE UNIQUE INDEX "Hand_id_gameId_key" ON "Hand"("id", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Hand_gameId_handNumber_key" ON "Hand"("gameId", "handNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Score_handId_participantRefId_key" ON "Score"("handId", "participantRefId");

-- AddForeignKey
ALTER TABLE "SavedPlayer" ADD CONSTRAINT "SavedPlayer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantRef" ADD CONSTRAINT "ParticipantRef_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantRef" ADD CONSTRAINT "ParticipantRef_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantRef" ADD CONSTRAINT "ParticipantRef_savedPlayerId_fkey" FOREIGN KEY ("savedPlayerId") REFERENCES "SavedPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantRef" ADD CONSTRAINT "ParticipantRef_anonymousParticipantId_fkey" FOREIGN KEY ("anonymousParticipantId") REFERENCES "AnonymousParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnonymousParticipant" ADD CONSTRAINT "AnonymousParticipant_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hand" ADD CONSTRAINT "Hand_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_handId_gameId_fkey" FOREIGN KEY ("handId", "gameId") REFERENCES "Hand"("id", "gameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_participantRefId_gameId_fkey" FOREIGN KEY ("participantRefId", "gameId") REFERENCES "ParticipantRef"("id", "gameId") ON DELETE RESTRICT ON UPDATE CASCADE;
