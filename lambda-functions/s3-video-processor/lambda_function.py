import asyncio
import os
from urllib.parse import unquote_plus
from uuid import uuid4
from aioboto3 import Session

background_blur = [
    "-filter_complex"
    "[0:v]scale=1080:1920,boxblur=30:1,eq=brightness=-0.1[bg]; [0:v]scale=900:-2[fg]; [bg][fg]overlay=(W-w)/2:(H-h)/2"
]
title_embedding = []
flip = []
zoom = []
speed_up = []
clip = lambda x: ["-ss", x["start"], "-es", x["end"]] if clip else []


async def ffmpeg_processing_and_upload(
    s3, clip_info: dict, file_path: str, bucket: str, project_name: str
):
    clip_id = clip_info.get("uuid", uuid4().hex)
    clip_file_path = f"/tmp/clips/{clip_id}.mp4"
    clip_storage_key = f"{project_name}/{clip.get("title", "")}-{clip_id}.mp4"
    await asyncio.create_subprocess_exec(
        "ffmpeg",
        "-i",
        file_path,
        *clip(clip_info),
        *background_blur,
        *title_embedding,
        *flip,
        *zoom,
        *speed_up,
        clip_file_path,
    )
    await s3.upload_file(
        Bucket=bucket,
        Key=clip_storage_key,
        Filename=clip_file_path,
    )
    os.remove(clip_file_path)
    # TODO: trigger subtitle generation lambda function here


async def process_video(s3, Key: str, Bucket: str):
    input_file_path = f"/tmp/{Bucket}/{Key}"
    corountines = []

    await s3.download_file(Key=Key, Bucket=Bucket, Filename=input_file_path)
    # TODO: search how to read file metadata and loop through each clip
    processing_routine = ffmpeg_processing_and_upload(
        s3, {}, input_file_path, Bucket, ""
    )
    corountines.append(processing_routine)
    await asyncio.gather(*corountines)
    await s3.delete_object(Bucket=Bucket, Key=Key)
    os.remove(input_file_path)


boto3_session = Session()


async def lambda_landler(event, context):
    async with boto3_session.client("s3") as s3:
        for event_record in event["Record"]:
            bucket_name: str = event_record["s3"]["bucket"]["name"]
            Key = unquote_plus(event_record["s3"]["object"]["key"])
            # TODO: try to use sqs to limit it to one event per function
            await process_video(s3, Key, bucket_name)

    return {"status": 200}
