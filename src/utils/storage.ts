import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StorageFileInfo } from "./types";

class Storage {
  private readonly s3: S3Client;
  readonly bucket: string;
  constructor() {
    this.s3 = new S3Client({ region: "eu-central-1" });
    this.bucket = process.env.BUCKET_NAME!;
  }

  async listFileinfos(parent?: string): Promise<StorageFileInfo[]> {
    const response = await this.s3.send(
      new ListObjectsV2Command({ Bucket: this.bucket }),
    );
  }

  async getUploadId(
    filename: string,
    ContentType: string,
    Metadata: Record<string, string>,
  ) {
    const response = await this.s3.send(
      new CreateMultipartUploadCommand({
        Bucket: this.bucket,
        Key: filename,
        ContentType,
        Metadata,
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
    Parts: { ETag: string; PartNumber: number }[],
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
