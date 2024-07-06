-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "current_status_id" INTEGER;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_current_status_id_fkey" FOREIGN KEY ("current_status_id") REFERENCES "task_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
