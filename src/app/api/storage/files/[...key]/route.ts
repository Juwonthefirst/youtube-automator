import { storage } from "@/utils/storage";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) => {
  const { key } = await params;
  try {
    await storage.deleteFile(key.join("/"));
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
  return NextResponse.json({ status: "success" });
};

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) => {
  const { key } = await params;
  try {
    const fileUrl = await storage.getFileUrl(key.join("/"));
    return NextResponse.json({ url: fileUrl });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
};
