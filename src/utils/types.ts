export interface StorageFileInfo {
  name: string;
  key: string;
  size: number;
  isFolder: boolean;
  created_at: string;
}

export interface UploadedPart {
  ETag: string;
  PartNumber: number;
}

export interface ActiveFileUpload {
  file: File | null;
  uploadId: string;
  partsToUpload: number[];
  uploadedParts: UploadedPart[];
  Key: string;
  errorMessage: string;
}
