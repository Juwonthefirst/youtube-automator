import { withRetry } from "./helper";
import { api } from "./api-client";
import {
  RequestData as StorageUploadIdRequest,
  ResponseData as StorageUploadIdResponse,
} from "@/app/api/storage/upload/id/route";
import {
  RequestData as StorageUploadPartRequest,
  ResponseData as StorageUploadPartResponse,
} from "@/app/api/storage/upload/part/route";
import { ActiveFileUpload, UploadedPart } from "./types";
import { RequestData as StorageUploadCompleteRequest } from "@/app/api/storage/upload/complete/route";
import { RequestData as StorageUploadCancelRequest } from "@/app/api/storage/upload/cancel/route";
import { Dispatch, SetStateAction } from "react";

export class FileUploader {
  static readonly chunkSize = 1024 * 1024 * 7;
  static async fetchUploadId(
    filename: string,
    Metadata: Record<string, string>,
  ) {
    const payload: StorageUploadIdRequest = {
      Key: filename,
      Metadata,
    };
    const response = await withRetry({
      func: () =>
        api.post<StorageUploadIdResponse>("/api/storage/upload/id", payload),
    });
    return response.data.uploadId;
  }

  static async uploadFilePart(
    PartNumber: number,
    UploadId: string,
    filePart: Blob,
    Key: string,
  ) {
    const payload: StorageUploadPartRequest = { UploadId, PartNumber, Key };
    const uploadUrlResponse = await withRetry({
      func: () =>
        api.post<StorageUploadPartResponse>(
          "/api/storage/upload/part",
          payload,
        ),
    });

    const uploadResponse = await withRetry({
      func: () => api.put(uploadUrlResponse.data.uploadUrl, filePart),
    });

    return uploadResponse.headers.ETag;
  }

  static async finishUpload(
    UploadId: string,
    uploadedParts: UploadedPart[],
    Key: string,
  ) {
    const payload: StorageUploadCompleteRequest = {
      UploadId,
      uploadedParts,
      Key,
    };

    await withRetry({
      func: () => api.post<null>("/api/storage/upload/complete", payload),
    });

    return true;
  }

  static async cancelUpload(UploadId: string, Key: string) {
    const payload: StorageUploadCancelRequest = {
      UploadId,
      Key,
    };

    await withRetry({
      func: () => api.post<null>("/api/storage/upload/cancel", payload),
    });

    return true;
  }

  static async uploadFile(
    file: File,
    UploadId: string,
    Key: string,
    partsToUpload: number[],
    uploadedParts: UploadedPart[],
    setState: Dispatch<SetStateAction<ActiveFileUpload[]>>,
  ) {
    try {
      for (const PartNumber of partsToUpload) {
        const sliceStart = (PartNumber - 1) * this.chunkSize;
        const sliceEnd = Math.min(sliceStart + this.chunkSize, file.size);
        const filePart = file.slice(sliceStart, sliceEnd);
        const ETag: string = await this.uploadFilePart(
          PartNumber,
          UploadId,
          filePart,
          Key,
        );
        uploadedParts.push({ PartNumber, ETag });
        setState((prev) =>
          prev.map((activeUpload) => {
            if (activeUpload.uploadId === UploadId)
              return {
                ...activeUpload,
                uploadedParts,
                partsToUpload: activeUpload.partsToUpload.filter(
                  (part) => part != PartNumber,
                ),
              };
            return activeUpload;
          }),
        );
      }

      await this.finishUpload(UploadId, uploadedParts, Key);
      setState((activeUploads) =>
        activeUploads.filter(
          (activeUpload) => activeUpload.uploadId != UploadId,
        ),
      );
    } catch {
      setState((prev) =>
        prev.map((activeUpload) => {
          if (activeUpload.uploadId === UploadId)
            return {
              ...activeUpload,
              errorMessage: "Upload error",
            };
          return activeUpload;
        }),
      );
    }
  }
}

export const createUploadFunction =
  (
    setActiveUploads: Dispatch<SetStateAction<ActiveFileUpload[]>>,
    setErrorMessage: Dispatch<SetStateAction<string>>,
  ) =>
  async (file: File, settings: Record<string, string>) => {
    const Key = "pending/" + file.name;
    const parts = Math.ceil(file.size / FileUploader.chunkSize);
    try {
      const UploadId = await FileUploader.fetchUploadId(Key, settings);
      const activeUploadState: ActiveFileUpload = {
        file,
        Key,
        uploadId: UploadId,
        partsToUpload: Array.from({ length: parts }, (_, i) => i + 1),
        uploadedParts: [],
        errorMessage: "",
      };
      FileUploader.uploadFile(
        file,
        UploadId,
        Key,
        activeUploadState.partsToUpload,
        activeUploadState.uploadedParts,
        setActiveUploads,
      );
      setActiveUploads((prev) => [activeUploadState, ...prev]);
    } catch {
      setErrorMessage(`Failed to Upload ${file.name}`);
    }
  };
