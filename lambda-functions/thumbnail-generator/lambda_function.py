import os
import subprocess
from urllib.parse import unquote_plus
import boto3

s3 = boto3.client("s3")


def create_and_upload_thumbnail(key: str, bucket: str):
    try:
        input_file_path = f"/tmp/{bucket}/{key}"
        key_paths = key.split(".")
        key_paths[-1] = "webp"
        output_key = f"thumbnails/{".".join(key_paths)}"
        output_file_path = f"/tmp/{output_key}"

        s3.download_file(Bucket=bucket, Key=key, Filename=input_file_path)
        subprocess.run(
            [
                "ffmpeg",
                "-i",
                input_file_path,
                "-vf",
                "thumbnail,scale=320:180",
                "-frames:v",
                "1",
                "-q:v",
                "75",
                output_file_path,
            ]
        )
        s3.upload_file(Bucket=bucket, Key=output_key, Filename=output_file_path)
        os.remove(input_file_path)
        os.remove(output_file_path)
    except Exception as err:
        pass


def lambda_handler(event, context):
    for event_record in event["Record"]:
        bucket_name: str = event_record["s3"]["bucket"]["name"]
        Key = unquote_plus(event_record["s3"]["object"]["key"])
        create_and_upload_thumbnail(Key, bucket_name)
        return {"status": 201}
