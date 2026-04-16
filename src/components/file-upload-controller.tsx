"use client";

import { createUploadFunction, FileUploader } from "@/utils/file-uploader";
import { ActiveFileUpload } from "@/utils/types";
import { useEffect, useState, createContext, useMemo } from "react";

interface UploadControls {
  hasActiveUploads: boolean;
  upload: (file: File, settings: Record<string, string>) => void;
  continueUpload: (UploadId: string) => void;
}
const ActiveUploadsContext = createContext<ActiveFileUpload[]>([]);
const UploadControlsContext = createContext<UploadControls | null>(null);
const FileUploadController = ({ children }: { children: React.ReactNode }) => {
  const [activeUploads, setActiveUploads] = useState<ActiveFileUpload[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const uploadControls = useMemo(
    () => ({
      hasActiveUploads: activeUploads.length > 0,
      upload: createUploadFunction(setActiveUploads, setErrorMessage),
      continueUpload: (UploadId: string) => {
        const upload = activeUploads.find(
          (activeUpload) => activeUpload.uploadId === UploadId,
        );
        if (!(upload && upload.file)) return;
        setActiveUploads((prev) =>
          prev.map((activeUpload) => {
            if (activeUpload.uploadId === UploadId)
              return {
                ...activeUpload,
                errorMessage: "",
              };
            return activeUpload;
          }),
        );
        FileUploader.uploadFile(
          upload.file,
          upload.uploadId,
          upload.Key,
          upload.partsToUpload,
          upload.uploadedParts,
          setActiveUploads,
        );
      },
    }),
    [activeUploads],
  );
  useEffect(() => {}, []);
  return (
    <ActiveUploadsContext value={activeUploads}>
      <UploadControlsContext value={uploadControls}>
        {children}
      </UploadControlsContext>
    </ActiveUploadsContext>
  );
};

export default FileUploadController;
