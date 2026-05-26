import { storage } from "@/utils/aws/storage";
import { UploadMetadata } from "@/utils/types";
import { NextResponse } from "next/server";

export interface RequestData {
  Key: string;
  Metadata: UploadMetadata;
  contentType: string;
}

export interface ResponseData {
  uploadId: string;
}

export const POST = async (req: Request) => {
  const data: RequestData = await req.json();
  try {
    const uploadId = await storage.getUploadId(
      data.Key,
      data.contentType,
      data.Metadata,
    );
    return NextResponse.json({ uploadId });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
};
