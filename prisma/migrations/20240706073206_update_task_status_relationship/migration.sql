/*
  Warnings:

  - Made the column `status` on table `task_status` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_at` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `status` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Made the column `current_status_id` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_current_status_id_fkey";

-- AlterTable
ALTER TABLE "task_status" ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "end_at" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL,
ALTER COLUMN "current_status_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_current_status_id_fkey" FOREIGN KEY ("current_status_id") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
