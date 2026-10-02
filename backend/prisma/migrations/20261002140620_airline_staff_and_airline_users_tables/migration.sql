/*
  Warnings:

  - You are about to drop the `Airline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Traveler` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AirlineUserRole" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "AirlineStaffRole" AS ENUM ('STAFF');

-- DropTable
DROP TABLE "Airline";

-- DropTable
DROP TABLE "Traveler";

-- CreateTable
CREATE TABLE "TRAVELER" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TRAVELER_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRLINE" (
    "id" TEXT NOT NULL,
    "airlineName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "iataCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIRLINE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRLINE_USER" (
    "id" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AirlineUserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIRLINE_USER_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRLINE_STAFF" (
    "id" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "AirlineStaffRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIRLINE_STAFF_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TRAVELER_email_key" ON "TRAVELER"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AIRLINE_contactEmail_key" ON "AIRLINE"("contactEmail");

-- CreateIndex
CREATE UNIQUE INDEX "AIRLINE_iataCode_key" ON "AIRLINE"("iataCode");

-- CreateIndex
CREATE UNIQUE INDEX "AIRLINE_USER_email_key" ON "AIRLINE_USER"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AIRLINE_STAFF_email_key" ON "AIRLINE_STAFF"("email");

-- AddForeignKey
ALTER TABLE "AIRLINE_USER" ADD CONSTRAINT "AIRLINE_USER_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "AIRLINE"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRLINE_STAFF" ADD CONSTRAINT "AIRLINE_STAFF_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "AIRLINE"("id") ON DELETE CASCADE ON UPDATE CASCADE;
