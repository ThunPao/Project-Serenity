/*
  Warnings:

  - You are about to drop the `UserInfo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[playerName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RedeemHistory" DROP CONSTRAINT "RedeemHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "ShopHistory" DROP CONSTRAINT "ShopHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userInfoId_fkey";

-- AlterTable
ALTER TABLE "RedeemHistory" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ShopHistory" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "playerName" TEXT;

-- DropTable
DROP TABLE "UserInfo";

-- CreateIndex
CREATE UNIQUE INDEX "User_playerName_key" ON "User"("playerName");

-- AddForeignKey
ALTER TABLE "ShopHistory" ADD CONSTRAINT "ShopHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedeemHistory" ADD CONSTRAINT "RedeemHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
