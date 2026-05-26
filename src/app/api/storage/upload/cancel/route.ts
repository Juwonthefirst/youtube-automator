import { storage } from "@/utils/aws/storage";
import { NextResponse } from "next/server";

export interface RequestData {
  UploadId: string;
  Key: string;
}

export const DELETE = async (req: Request) => {
  const data: RequestData = await req.json();
  try {
    await storage.cancelPartUpload(data.UploadId, data.Key);
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
  return NextResponse.json({ status: "success" });
};
