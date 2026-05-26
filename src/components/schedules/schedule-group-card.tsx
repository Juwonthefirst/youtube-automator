import { parseDateString } from "@/utils/helper";
import Link from "next/link";

interface ScheduleGroupCardProps {
  name: string;
  creationDate?: Date;
  state?: string;
}

const ScheduleGroupCard = ({
  name,
  creationDate,
  state,
}: ScheduleGroupCardProps) => {
  const createdAtFormatted = creationDate
    ? parseDateString({ dateString: creationDate.toString() })
    : "Unknown";

  const isActive = state === "ACTIVE";

  return (
    <Link href={`/schedules/${name}`}>
      <article className="flex items-center gap-2 sm:gap-3 rounded-xl border-[1.5px] border-black/20 bg-white px-2 sm:px-3 py-1.5 transition-all duration-200 hover:border-black/80 dark:border-white/20 dark:bg-black dark:hover:border-white/80 min-w-0 cursor-pointer">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p className="font-medium truncate">{name}</p>
          <div className="flex justify-between gap-2 text-xs opacity-80 overflow-hidden">
            <p className="truncate">{createdAtFormatted}</p>
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0 ${
                isActive
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              }`}
            >
              <div
                className={`size-1.5 rounded-full ${isActive ? "bg-green-700 dark:bg-green-300" : "bg-neutral-700 dark:bg-neutral-300"}`}
              />
              <span className="text-xs font-medium">{state || "Unknown"}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ScheduleGroupCard;
