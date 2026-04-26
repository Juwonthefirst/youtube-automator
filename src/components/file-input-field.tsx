import { UploadCloud } from "lucide-react";
import Video from "./video";

const FileInputField = ({ selectedFile }: { selectedFile: File | null }) => {
  return (
    <div className="flex justify-center items-center w-full h-full bg-black/5 dark:bg-white/5 text-black dark:text-white text-sm p-4 border-dashed border-3 dark:border-white rounded-xl">
      {selectedFile ? (
        <Video
          file={selectedFile}
          className="w-9/10 h-9/10 object-cover"
          controls
        />
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center">
          <UploadCloud className="size-12" />
          <p className="text-base">Select or drop video to clip here</p>
        </div>
      )}
    </div>
  );
};

export default FileInputField;
