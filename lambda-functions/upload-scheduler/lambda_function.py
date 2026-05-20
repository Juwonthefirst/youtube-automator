from datetime import datetime, timedelta
import json
import os
from random import random
import boto3

s3 = boto3.client("s3")
scheduler = boto3.client("scheduler")


def create_upload_schedule(Key: str, bucket_name: str, index: int):
    upload_hours = [7, 13, 20]
    upload_dates = [timedelta(hours=7, minutes=random() * 60)]
    scheduler.create_schedule(
        Name=f"{Key} Youtube upload schedule",
        # ScheduleExpression=f"at({trigger_time.isoformat()})",
        FlexibleTimeWindow={"Mode": "OFF"},
        ActionAfterCompletion="DELETE",
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
