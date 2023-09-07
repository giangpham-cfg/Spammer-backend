/*
  Warnings:

  - You are about to drop the `Children` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Children" DROP CONSTRAINT "Children_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Children" DROP CONSTRAINT "Children_parentNestedId_fkey";

-- DropTable
DROP TABLE "Children";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
