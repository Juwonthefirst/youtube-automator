import { StorageFolderInfo } from "@/utils/types";
import { Folder } from "lucide-react";
import MenuBtn from "./menu-btn";
import Link from "next/link";

const FolderCard = (props: StorageFolderInfo) => {
  return (
    <Link
      href={`files/${props.Key}`}
      className="flex items-center gap-3 bg-white dark:bg-black border-black/20 dark:border-white/20 border-[1.5px] rounded-xl px-3 py-1.5 hover:border-black/80 dark:hover:border-white/80 transition-all duration-200"
    >
      <Folder className="fill-neutral-800 dark:fill-white size-12 text-white dark:text-black stroke-1" />
      <div className="flex flex-col flex-1 gap-1">
        <p className="font-medium col-span-3">{props.name}</p>
      </div>
      <MenuBtn Key={props.Key} />
    </Link>
  );
};

export default FolderCard;
