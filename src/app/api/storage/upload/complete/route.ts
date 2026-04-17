import { storage } from "@/utils/storage";
import { UploadedPart } from "@/utils/types";
import { NextResponse } from "next/server";

export interface RequestData {
  UploadId: string;
  uploadedParts: UploadedPart[];
  Key: string;
}

export const POST = async (req: Request) => {
  const data: RequestData = await req.json();
  try {
    await storage.completeFileUpload(
      data.Key,
      data.UploadId,
      data.uploadedParts,
    );
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
  return NextResponse.json({ status: "success" });
};
