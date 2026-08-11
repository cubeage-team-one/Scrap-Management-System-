-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('INDUSTRY', 'DEALER', 'BUYER', 'PLATFORM');

-- CreateEnum
CREATE TYPE "AccountState" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'INDUSTRY', 'DEALER', 'BUYER');

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessType" "BusinessType" NOT NULL,
    "gstNumber" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "accountState" "AccountState" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_gstNumber_key" ON "Organisation"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
