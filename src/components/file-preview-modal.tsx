import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FilePreviewModalProps {
  name: string;
  fileURL: string;
  currentPath: string[];
}

const getFileType = (fileName: string): "video" | "image" | "unknown" => {
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "mkv", "avi", "flv"];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension && videoExtensions.includes(extension)) return "video";
  if (extension && imageExtensions.includes(extension)) return "image";
  return "unknown";
};

export default async function FilePreviewModal({
  name,
  fileURL,
  currentPath,
}: FilePreviewModalProps) {
  const fileType = getFileType(name);

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-black/20 dark:border-white/20 px-6 py-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-lg truncate">{name}</h2>
          </div>
          <Link
            href={`/files/${currentPath.join("/")}`}
            className="ml-4 p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0"
          >
            <X size={24} />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden p-6 bg-black/5 dark:bg-white/5">
          {fileType === "video" && (
            <video
              src={fileURL}
              controls
              className="max-w-full max-h-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          )}

          {fileType === "image" && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={fileURL}
                alt={name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
            </div>
          )}

          {fileType === "unknown" && (
            <div className="text-center">
              <p className="text-black/60 dark:text-white/60 mb-4">
                Preview not available for this file type
              </p>
              <a
                href={fileURL}
                download
                className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg py-2 px-4 hover:ring-4 ring-black/10 dark:ring-white/20 transition-all"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
