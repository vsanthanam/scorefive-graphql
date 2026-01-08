-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "ParticipantRefType" AS ENUM ('USER', 'SAVED_PLAYER', 'ANONYMOUS');

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
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "SavedPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "scoreLimit" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantRef" (
    "id" UUID NOT NULL,
    "referenceId" TEXT,
    "participantType" "ParticipantRefType" NOT NULL,
    "anonymousDisplayName" TEXT,
    "gameId" UUID NOT NULL,
    "turnOrder" INTEGER NOT NULL,

    CONSTRAINT "ParticipantRef_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hand" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "handNumber" INTEGER NOT NULL,
    "gameId" UUID NOT NULL,

    CONSTRAINT "Hand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "points" INTEGER NOT NULL,
    "participantRefId" UUID NOT NULL,
    "handId" UUID NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE INDEX "Game_ownerId_idx" ON "Game"("ownerId");

-- CreateIndex
CREATE INDEX "ParticipantRef_gameId_idx" ON "ParticipantRef"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantRef_id_gameId_key" ON "ParticipantRef"("id", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantRef_gameId_participantType_referenceId_key" ON "ParticipantRef"("gameId", "participantType", "referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantRef_gameId_turnOrder_key" ON "ParticipantRef"("gameId", "turnOrder");

-- CreateIndex
CREATE INDEX "Hand_gameId_idx" ON "Hand"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Hand_handNumber_gameId_key" ON "Hand"("handNumber", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Hand_id_gameId_key" ON "Hand"("id", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Score_participantRefId_handId_key" ON "Score"("participantRefId", "handId");

-- AddForeignKey
ALTER TABLE "SavedPlayer" ADD CONSTRAINT "SavedPlayer_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantRef" ADD CONSTRAINT "ParticipantRef_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hand" ADD CONSTRAINT "Hand_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_participantRefId_fkey" FOREIGN KEY ("participantRefId") REFERENCES "ParticipantRef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_handId_fkey" FOREIGN KEY ("handId") REFERENCES "Hand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
