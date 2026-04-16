import { UploadedPart } from "@/utils/types";

export interface RequestData {
  UploadId: string;
  uploadedParts: UploadedPart[];
  Key: string;
}
