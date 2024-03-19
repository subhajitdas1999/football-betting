-- CreateTable
CREATE TABLE "Leagues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "season" DECIMAL(65,30) NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "leagueId" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leagues_pkey" PRIMARY KEY ("id")
);
