import { ScheduleGroupSummary } from "@aws-sdk/client-scheduler";
import ScheduleGroupCard from "./schedule-group-card";

interface SchedulesListProps {
  scheduleGroups: ScheduleGroupSummary[];
}

const SchedulesList = ({ scheduleGroups }: SchedulesListProps) => {
  if (scheduleGroups.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 rounded-xl border-2 border-dashed border-black/20 dark:border-white/20">
        <div className="text-center">
          <p className="text-black/60 dark:text-white/60">
            No schedule groups found
          </p>
          <p className="text-sm text-black/40 dark:text-white/40 mt-1">
            Create a new schedule group to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {scheduleGroups.map((group) => (
        <ScheduleGroupCard
          key={group.Name}
          name={group.Name || ""}
          creationDate={group.CreationDate}
          state={group.State}
        />
      ))}
    </section>
  );
};

export default SchedulesList;
