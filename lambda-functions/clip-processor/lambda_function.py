import json
import os
import subprocess
import boto3

s3 = boto3.client("s3")
sqs_queue = boto3.client("sqs")


title_embedding = (
    lambda x: f"drawtext=text={x}:x=(w-text_w)/2:y=40:fontsize=60:fontcolor=white:box=1:boxcolor=black@0.5"
)
background_blur = "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30,eq=brightness=-0.10[bg];[0:v]scale=1080:1350[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p"
zoom = []
speed_up = []
clip = lambda x: ["-ss", x["start"], "-to", x["end"]] if clip else []


def process_clip(Key: str, Bucket: str, metadata: dict):
    input_file_path = f"/tmp/{Bucket}/{Key}"
    output_file_path = f"/tmp/output/{Key}"

    s3.download_file(Key=Key, Bucket=Bucket, Filename=input_file_path)

    subprocess.run(
        [
            "ffmpeg",
            "-i",
            input_file_path,
            "-filter_complex",
            background_blur,
            *zoom,
            *speed_up,
            output_file_path,
        ]
    )
    s3.upload_file(
        Bucket=Bucket,
        Key=Key,
        Filename=output_file_path,
    )
    queue_data = {"bucket_name": Bucket, "key": Key}
    sqs_queue.send_message(
        QueueUrl=os.getenv("QUEUE_URL"), MessageBody=json.dumps(queue_data)
    )

    os.remove(output_file_path)
    os.remove(input_file_path)


def lambda_handler(event, context):
    for event_record in event["Record"]:
        data = json.loads(event_record["body"])
        bucket_name: str = data["bucket_name"]
        Key = data["key"]
        metadata = data.get("metadata", {})
        process_clip(Key, bucket_name, metadata)

    return {"status": 200}
