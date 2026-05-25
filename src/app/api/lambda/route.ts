import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { NextResponse } from "next/server";

export interface LambdaRequestBody {
  parent_key: string;
}

export const POST = async (req: Request) => {
  const data: LambdaRequestBody = await req.json();
  const client = new LambdaClient({
    region: process.env.AWS_REGION,
  });
  const payload = {
    bucket: process.env.BUCKET_NAME,
    parent_key: data.parent_key,
  };
  const response = await client.send(
    new InvokeCommand({
      FunctionName: process.env.LAMBDA_FUNCTION_NAME,
      Payload: JSON.stringify(payload),
    }),
  );
  return NextResponse.json({
    status: "success",
    statusCode: response.StatusCode,
  });
};
