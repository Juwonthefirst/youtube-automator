import { storage } from "@/utils/aws/storage";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) => {
  const { key } = await params;

  if (key.length == 0)
    return NextResponse.json({ status: "error" }, { status: 403 });
  try {
    await storage.deleteFile(key.join("/"));
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
  return NextResponse.json({ status: "success" });
};
