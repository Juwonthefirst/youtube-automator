import { ActiveFileUpload } from "@/utils/types";
import Video from "./video";
import ProgressBar from "./progressbar";
import UploadControl from "./upload-control-btns";

const ActiveUploadCard = (props: ActiveFileUpload) => {
  const percentOfFileUploaded =
    props.uploadedParts.length /
    (props.partsToUpload.length + props.uploadedParts.length);
  if (!props.file) return;
  const fileSizeInMB = props.file.size / (1024 * 1024);
  return (
    <article className="flex flex-col items-center gap-3 bg-white dark:bg-black border-black/20 dark:border-white/20 border-[1.5px] rounded-xl px-3 py-1.5 hover:border-black/80 dark:hover:border-white/80 transition-all duration-200">
      <div className="flex gap-2 items-center">
        <Video
          file={props.file}
          className="rounded-sm object-cover h-12 w-12 shadow-md"
        />

        <p className="text-sm">{props.file?.name}</p>
      </div>
      <ProgressBar percent={String(percentOfFileUploaded * 100)} />
      <div className="flex items-center justify-between text-sm opacity-80">
        <p>{`${(percentOfFileUploaded * fileSizeInMB).toFixed(2)} mb of ${fileSizeInMB.toFixed(2)} uploaded`}</p>
        <UploadControl
          errorMessage={props.errorMessage}
          UploadId={props.uploadId}
        />
      </div>
    </article>
  );
};

export default ActiveUploadCard;
