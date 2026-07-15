/*
  Warnings:

  - A unique constraint covering the columns `[rentalOrderId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rentalOrderId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "rentalOrderId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_rentalOrderId_key" ON "Review"("rentalOrderId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_rentalOrderId_fkey" FOREIGN KEY ("rentalOrderId") REFERENCES "RentalOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
