"use client";

import { createUploadFunction, FileUploader } from "@/utils/file-uploader";
import { ActiveFileUpload } from "@/utils/types";
import { useState, createContext, useMemo } from "react";
import InfoPopup from "./info-popup";

interface UploadControls {
  hasActiveUploads: boolean;
  upload: (file: File, settings: Record<string, string>) => Promise<void>;
  continueUpload: (UploadId: string) => void;
  cancelUpload: (UploadId: string) => Promise<void>;
}
export const ActiveUploadsContext = createContext<ActiveFileUpload[]>([]);
export const UploadControlsContext = createContext<UploadControls | null>(null);
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
      cancelUpload: async (UploadId: string) => {
        const upload = activeUploads.find(
          (activeUpload) => activeUpload.uploadId === UploadId,
        );
        if (!(upload && upload.file)) return;
        await FileUploader.cancelUpload(UploadId, upload.Key);
        setActiveUploads(
          activeUploads.filter(
            (activeUpload) => activeUpload.uploadId !== UploadId,
          ),
        );
      },
    }),
    [activeUploads],
  );

  return (
    <ActiveUploadsContext value={activeUploads}>
      <UploadControlsContext value={uploadControls}>
        {children}
        <InfoPopup
          open={errorMessage !== ""}
          onClose={() => setErrorMessage("")}
        >
          <p className="text-sm text-center">{errorMessage}</p>
        </InfoPopup>
      </UploadControlsContext>
    </ActiveUploadsContext>
  );
};

export default FileUploadController;
