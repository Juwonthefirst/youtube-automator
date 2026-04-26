export interface StorageFileInfo {
  name: string;
  Key: string;
  size: number;
  thumbnailURL: string;
  created_at: string;
}

export interface StorageFolderInfo {
  name: string;
  Key: string;
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
  isUploading: boolean;
}
export interface Clip {
  start: string;
  end: string;
  title: string;
  uuid: string;
}
export interface UploadMetadata {
  clipName: string;
  clips: Clip[];
}
