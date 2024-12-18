/*
  Warnings:

  - You are about to drop the column `coins` on the `UserInfo` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `UserInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserInfo" DROP COLUMN "coins",
DROP COLUMN "points";
