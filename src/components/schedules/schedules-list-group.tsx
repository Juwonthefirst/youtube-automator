import { ScheduleSummary } from "@aws-sdk/client-scheduler";
import ScheduleCard from "./schedule-card";

interface SchedulesListProps {
  schedules: ScheduleSummary[];
}

const SchedulesList = ({ schedules }: SchedulesListProps) => {
  if (schedules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 rounded-xl border-2 border-dashed border-black/20 dark:border-white/20">
        <div className="text-center">
          <p className="text-black/60 dark:text-white/60">
            No schedules found in this group
          </p>
          <p className="text-sm text-black/40 dark:text-white/40 mt-1">
            Create a new schedule to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.Name}
          name={schedule.Name || ""}
          state={schedule.State}
          creationDate={schedule.CreationDate}
        />
      ))}
    </section>
  );
};

export default SchedulesList;
