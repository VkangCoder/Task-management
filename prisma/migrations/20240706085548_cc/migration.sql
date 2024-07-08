-- AddForeignKey
ALTER TABLE "task_status" ADD CONSTRAINT "task_status_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
