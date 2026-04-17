import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) => {
  const { key } = await params;
  return NextResponse.json({ key: key.join("/") });
};
