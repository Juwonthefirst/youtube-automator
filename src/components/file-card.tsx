import { StorageFileInfo } from "@/utils/types";
import MenuBtn from "./menu-btn";
import { parseDateString } from "@/utils/helper";
import Thumbnail from "./thumbnail";
import Link from "next/link";

const FileCard = (props: StorageFileInfo) => {
  const fileSizeInMB = (props.size / (1024 * 1024)).toFixed(2);
  const previewUrl = `/preview/${props.Key}`;

  return (
    <article className="flex items-center gap-2 sm:gap-3 rounded-xl border-[1.5px] border-black/20 bg-white px-2 sm:px-3 py-1.5 transition-all duration-200 hover:border-black/80 dark:border-white/20 dark:bg-black dark:hover:border-white/80 min-w-0">
      <Link href={previewUrl} className="shrink-0">
        <Thumbnail
          src={props.thumbnailURL}
          alt={`Thumbnail for ${props.name}`}
          width={40}
          height={40}
          className="size-8 sm:size-10 rounded-md object-cover shadow-md hover:ring-2 ring-black/40 dark:ring-white/40 transition-all"
        />
      </Link>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <Link
          href={previewUrl}
          className="font-medium truncate hover:text-black/70 dark:hover:text-white/70 transition-colors"
        >
          {props.name}
        </Link>
        <div className="flex justify-between gap-2 text-xs opacity-80 overflow-hidden">
          <p className="truncate">{fileSizeInMB}MB</p>
          <p className="truncate">
            {parseDateString({ dateString: props.created_at })}
          </p>
        </div>
      </div>
      <div className="shrink-0">
        <MenuBtn Key={props.Key} />
      </div>
    </article>
  );
};

export default FileCard;
