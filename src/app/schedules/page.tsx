import SchedulesList from "@/components/schedules/schedules-list";
import { scheduler } from "@/utils/aws/scheduler";

export const dynamic = "force-dynamic";
export default async function SchedulesPage() {
  const scheduleGroups = await scheduler.listScheduleGroups();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Schedules</h1>
        <p className="text-black/60 dark:text-white/60 mt-2">
          Manage your scheduled uploads
        </p>
      </div>

      <SchedulesList scheduleGroups={scheduleGroups} />
    </div>
  );
}
