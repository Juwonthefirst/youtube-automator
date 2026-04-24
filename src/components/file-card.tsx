import { StorageFileInfo } from "@/utils/types";
import MenuBtn from "./menu-btn";
import { parseDateString } from "@/utils/helper";
import Image from "next/image";

const FileCard = (props: StorageFileInfo) => {
  const fileSizeInMB = (props.size / (1024 * 1024)).toFixed(2);
  return (
    <article className="flex items-center gap-3 bg-white dark:bg-black border-black/20 dark:border-white/20 border-[1.5px] rounded-xl px-3 py-1.5 hover:border-black/80 dark:hover:border-white/80 transition-all duration-200">
      <Image
        src={props.thumbnailURL}
        alt={`Thumbnail for ${props.name}`}
        width={40}
        height={80}
        className="shadow-md rounded-md object-cover"
      />
      <div className="flex flex-col flex-1 gap-1">
        <p className="font-medium col-span-3">{props.name}</p>
        <div className="flex justify-between text-xs opacity-80">
          <p className="">{fileSizeInMB + "MB"}</p>
          <p>{parseDateString({ dateString: props.created_at })}</p>
        </div>
      </div>
      <MenuBtn Key={props.Key} />
    </article>
  );
};

export default FileCard;
