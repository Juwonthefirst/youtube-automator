export interface RequestData {
  Key: string;
  Metadata: Record<string, string>;
}

export interface ResponseData {
  uploadId: string;
}

export const POST = async () => {
  return "hello";
};
