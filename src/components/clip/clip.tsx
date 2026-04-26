import type { Clip } from "@/utils/types";
import { Film, X } from "lucide-react";

const Clip = (props: Clip & { onRemove: () => void }) => {
  return (
    <article className="flex gap-4 relative w-fit items-center">
      <Film />
      <div className="flex flex-col gap-1">
        <p className="text-sm">{props.title}</p>
        <div className="text-xs opacity-80 flex gap-6">
          <p>Start time: {props.start}</p>
          <p>End time: {props.end}</p>
        </div>
        <button
          className="absolute -top-1 -right-1 p-1 rounded-full text-red-500 hover:bg-black/10 dark:hover:bg-white/20 transition-all"
          type="button"
          onClick={props.onRemove}
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>
    </article>
  );
};

export default Clip;
