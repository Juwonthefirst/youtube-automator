import { StorageFolderInfo } from "@/utils/types";
import { Folder } from "lucide-react";
import MenuBtn from "./menu-btn";
import Link from "next/link";

const FolderCard = (props: StorageFolderInfo) => {
  return (
    <article className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-black border-black/20 dark:border-white/20 border-[1.5px] rounded-xl px-2 sm:px-3 py-1.5 hover:border-black/80 dark:hover:border-white/80 transition-all duration-200 min-w-0">
      <Link
        href={`files/${props.Key}`}
        className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
      >
        <Folder className="fill-neutral-800 dark:fill-white size-10 sm:size-12 text-white dark:text-black stroke-1 shrink-0" />
        <div className="flex flex-col flex-1 gap-1 min-w-0">
          <p className="font-medium truncate">{props.name}</p>
        </div>
      </Link>
      <div className="shrink-0">
        <MenuBtn Key={props.Key} />
      </div>
    </article>
  );
};

export default FolderCard;
