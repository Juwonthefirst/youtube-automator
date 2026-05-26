import { storage } from "@/utils/aws/storage";
import { NextResponse } from "next/server";

export interface RequestData {
  UploadId: string;
  PartNumber: number;
  Key: string;
}

export interface ResponseData {
  uploadUrl: string;
}

export const POST = async (req: Request) => {
  const data: RequestData = await req.json();
  try {
    const uploadUrl = await storage.getUploadPartUrl(
      data.UploadId,
      data.PartNumber,
      data.Key,
    );
    return NextResponse.json({ uploadUrl });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
};
