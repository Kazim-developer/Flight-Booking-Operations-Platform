-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "travelerId" TEXT;

-- CreateIndex
CREATE INDEX "Booking_travelerId_idx" ON "Booking"("travelerId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "TRAVELER"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
