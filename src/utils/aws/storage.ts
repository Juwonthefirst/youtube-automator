import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StorageFolderInfo, UploadedPart, UploadMetadata } from "../types";
import path from "path";
import { notFound } from "next/navigation";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  DeleteObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";

class Storage {
  private readonly s3: S3Client;
  readonly bucket: string;
  constructor() {
    this.s3 = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    });
    this.bucket = process.env.BUCKET_NAME!;
  }

  async listChildren(parentKey?: string) {
    if (parentKey && !parentKey.endsWith("/")) parentKey += "/";
    const response = await this.s3.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Delimiter: "/",
        Prefix: parentKey,
      }),
    );

    const subFolders = (response.CommonPrefixes || []).map<StorageFolderInfo>(
      (subFolder) => ({
        name: path.parse(subFolder.Prefix!).base,
        Key: subFolder.Prefix!,
      }),
    );

    const files = [];
    for (const file of response.Contents || [])
      files.push({
        name: path.parse(file.Key!).base,
        Key: file.Key!,
        size: file.Size || 0,
        created_at: file.LastModified?.toISOString() || "",
        thumbnailURL: await this.getThumbnailUrl(file.Key!),
      });

    return {
      files,
      subFolders,
    };
  }

  async getFileUrl(Key: string) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key });
    return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }

  async getThumbnailUrl(originFileKey: string) {
    if (originFileKey.startsWith("thumbnails"))
      return await this.getFileUrl(originFileKey);

    const originFilePath = originFileKey.split(".");
    originFilePath[originFilePath.length - 1] = "webp";
    const thumbnailKey = "thumbnails/" + originFilePath.join(".");
    return await this.getFileUrl(thumbnailKey);
  }

  async getUploadId(
    Key: string,
    ContentType: string,
    Metadata: UploadMetadata,
  ) {
    const response = await this.s3.send(
      new CreateMultipartUploadCommand({
        Bucket: this.bucket,
        Key,
        ContentType,
        Metadata: { processor_settings: JSON.stringify(Metadata) },
      }),
    );

    return response.UploadId;
  }

  async getUploadPartUrl(UploadId: string, PartNumber: number, Key: string) {
    const partUploadCommand = new UploadPartCommand({
      Bucket: this.bucket,
      Key,
      PartNumber,
      UploadId,
    });

    return await getSignedUrl(this.s3, partUploadCommand, { expiresIn: 3600 });
  }

  async completeFileUpload(
    Key: string,
    UploadId: string,
    Parts: UploadedPart[],
  ) {
    await this.s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.bucket,
        Key,
        MultipartUpload: { Parts },
        UploadId,
      }),
    );

    return true;
  }

  async cancelPartUpload(UploadId: string, Key: string) {
    await this.s3.send(
      new AbortMultipartUploadCommand({ Bucket: this.bucket, Key, UploadId }),
    );

    return true;
  }

  async deleteFile(Key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key,
      }),
    );

    return true;
  }
}

export const storage = new Storage();

export const handleS3Error = <Type>(func: () => Promise<Type>) => {
  return async () => {
    try {
      return await func();
    } catch (e: unknown) {
      if (e instanceof S3ServiceException) {
        if (e.$response?.statusCode === 404) throw notFound();
      }
      throw e;
    }
  };
};
