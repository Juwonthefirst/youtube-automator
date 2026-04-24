import asyncio
import os
from urllib.parse import unquote_plus
from aioboto3 import Session


async def download_and_upload_thumbnail(s3, key: str, bucket: str):
    try:
        input_file_path = f"/tmp/{key}/input_file.mp4"
        key_paths = key.split(".")
        key_paths[-1] = "webp"
        output_key = f"thumbnails/{".".join(key_paths)}"
        output_file_path = f"/tmp/{output_key}"

        await s3.download_file(Bucket=bucket, Key=key, Filename=input_file_path)
        await asyncio.create_subprocess_exec(
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
        )
        await s3.upload_file(Bucket=bucket, Key=key, Filename=output_file_path)
        os.remove(input_file_path)
        os.remove(output_file_path)
    except Exception as err:
        pass


async def lambda_handler(event, context):
    aws_session = Session()
    file_processes = []
    with aws_session.client("s3") as s3:
        for event_record in event["Record"]:
            bucket_name: str = event_record["s3"]["bucket"]["name"]
            Key = unquote_plus(event_record["s3"]["object"]["key"])
            file_processes.append(download_and_upload_thumbnail(s3, Key, bucket_name))

        await asyncio.gather(*file_processes)

        return {"status": 201}
