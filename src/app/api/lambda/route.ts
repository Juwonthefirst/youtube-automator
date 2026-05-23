import { api } from "@/utils/api-client";
import { NextResponse } from "next/server";

export interface LambdaRequestBody {
  parent_key: string;
}

export const POST = async (req: Request) => {
  const data: LambdaRequestBody = await req.json();
  await api.post<void>(process.env.LAMBDA_URL!, {
    parent_key: data.parent_key,
    bucket: process.env.BUCKET_NAME!,
  });
  return NextResponse.json({ status: "success" });
};
