import { StorageFileInfo } from "@/utils/types";
import MenuBtn from "./menu-btn";
import { parseDateString } from "@/utils/helper";
import Thumbnail from "./thumbnail";

const FileCard = (props: StorageFileInfo) => {
  const fileSizeInMB = (props.size / (1024 * 1024)).toFixed(2);
  return (
    <article className="flex items-center gap-3 rounded-xl border-[1.5px] border-black/20 bg-white px-3 py-1.5 transition-all duration-200 hover:border-black/80 dark:border-white/20 dark:bg-black dark:hover:border-white/80">
      <Thumbnail
        src={props.thumbnailURL}
        alt={`Thumbnail for ${props.name}`}
        width={40}
        height={40}
        className="size-10 rounded-md object-cover shadow-md"
      />
      <div className="flex flex-col gap-1 w-3/4">
        <p className="line-clamp-1 font-medium whitespace-nowrap text-ellipsis">
          {props.name}
        </p>
        <div className="flex justify-between text-xs opacity-80">
          <p>{fileSizeInMB}MB</p>
          <p>{parseDateString({ dateString: props.created_at })}</p>
        </div>
      </div>
      <MenuBtn Key={props.Key} />
    </article>
  );
};

export default FileCard;
