from datetime import datetime, timedelta
import json
import os
from random import random
import boto3

s3 = boto3.client("s3")
scheduler = boto3.client("scheduler")


def create_upload_schedule(Key: str, bucket_name: str, index: int):
    # random acts noise to create inconsistent upload time
    upload_delay_in_hours = round(12 + (6 * random()))
    upload_delay_in_minutes = round(60 * random())
    upload_delay_in_seconds = round(60 * random())
    trigger_time = datetime.now() + timedelta(
        hours=index * upload_delay_in_hours,
        minutes=upload_delay_in_minutes if index >= 1 else 0,
        seconds=upload_delay_in_seconds if index >= 1 else 0,
    )
    scheduler.create_schedule(
        Name=f"{Key} Youtube upload schedule",
        ScheduleExpression=f"at({trigger_time.isoformat()})",
        FlexibleTimeWindow={"Mode": "OFF"},
        Target={
            "Arn": os.getenv("TARGET_ARN"),
            "Input": json.dumps({"bucket": bucket_name, "key": Key}),
            "RoleArn": os.getenv("TARGET_ROLE_ARN"),
        },
    )


def lambda_handler(event, context):
    bucket_name: str = event["bucket"]
    parent_key: str = event["parent_key"]
    if not parent_key.endswith("/"):
        parent_key += "/"
    files = s3.list_objects_v2(Bucket=bucket_name, Prefix=parent_key, Delimiter="/")
    for index, file_key in enumerate(files.get("Content", [])):
        create_upload_schedule(scheduler, file_key, bucket_name, index)

    return {"status": 200}
