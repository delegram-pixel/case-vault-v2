-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLERK',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'Verified',
    "barNumber" TEXT,
    "firm" TEXT,
    "state" TEXT,
    "yearCalled" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "filingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "judgeName" TEXT NOT NULL,
    "courtType" TEXT NOT NULL,
    "courtState" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attorney" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "firm" TEXT,
    "representing" TEXT NOT NULL,
    "barNumber" TEXT,

    CONSTRAINT "Attorney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT,
    "size" TEXT,
    "uploadedById" TEXT,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocketEntry" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "filingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "docketType" TEXT NOT NULL,
    "docketText" TEXT NOT NULL,
    "filingParty" TEXT NOT NULL,

    CONSTRAINT "DocketEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hearing" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "judgeName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Scheduled',

    CONSTRAINT "Hearing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRecord" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "servedOn" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "ServiceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Court" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'logged',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");

-- CreateIndex
CREATE INDEX "Case_status_idx" ON "Case"("status");

-- CreateIndex
CREATE INDEX "Case_courtState_idx" ON "Case"("courtState");

-- CreateIndex
CREATE INDEX "DocketEntry_caseId_idx" ON "DocketEntry"("caseId");

-- CreateIndex
CREATE INDEX "Hearing_dateTime_idx" ON "Hearing"("dateTime");

-- CreateIndex
CREATE INDEX "Hearing_roomNumber_dateTime_idx" ON "Hearing"("roomNumber", "dateTime");

-- CreateIndex
CREATE INDEX "Court_type_state_idx" ON "Court"("type", "state");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attorney" ADD CONSTRAINT "Attorney_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attorney" ADD CONSTRAINT "Attorney_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocketEntry" ADD CONSTRAINT "DocketEntry_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hearing" ADD CONSTRAINT "Hearing_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
