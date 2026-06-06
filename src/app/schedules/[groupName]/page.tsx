import SchedulesList from "@/components/schedules/schedules-list-group";
import { scheduler } from "@/utils/aws/scheduler";
import BackButton from "@/components/schedules/back-button";

export const dynamic = "force-dynamic";
export default async function GroupSchedulesPage({
  params,
}: {
  params: Promise<{ groupName: string }>;
}) {
  const { groupName } = await params;
  const response = await scheduler.listSchedules(groupName);
  const schedules = response.Schedules || [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold">{groupName}</h1>
          <p className="text-black/60 dark:text-white/60 mt-2">
            {schedules.length}{" "}
            {schedules.length === 1 ? "schedule" : "schedules"}
          </p>
        </div>
      </div>

      <SchedulesList schedules={schedules} />
    </div>
  );
}
