import { StorageFileInfo } from "@/utils/types";

const FileCard = (props: StorageFileInfo) => {
  return (
    <article className="flex bg-black border-white/20 border rounded-xl px-4 py-2">
      <div className="grid grid-cols-5">
        <p className="font-medium col-span-3">{props.name}</p>
      </div>
    </article>
  );
};

export default FileCard;
