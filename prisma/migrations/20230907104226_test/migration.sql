/*
  Warnings:

  - Added the required column `parentNestedId` to the `Children` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Children" ADD COLUMN     "parentNestedId" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "Children" ADD CONSTRAINT "Children_parentNestedId_fkey" FOREIGN KEY ("parentNestedId") REFERENCES "Children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
