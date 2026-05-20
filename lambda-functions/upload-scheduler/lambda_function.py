from datetime import datetime, timedelta, timezone
import json
import os
from random import randint
import boto3

s3 = boto3.client(
    "s3",
    endpoint_url=os.getenv("S3_ENDPOINT_URL"),
    aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
    region_name="auto",
)
scheduler = boto3.client("scheduler")

upload_hours = [14, 18, 21]


def get_upload_hour_index_shift(current_hour: int):
    starting_index = 0
    while (
        starting_index < len(upload_hours)
        and current_hour >= upload_hours[starting_index]
    ):
        starting_index += 1
    return starting_index


def create_upload_schedule(Key: str, bucket_name: str, index: int):
    trigger_hour_index = index % len(upload_hours)
    trigger_time = datetime.now(timezone.utc).replace(
        hour=upload_hours[trigger_hour_index],
        minute=randint(0, 10),
        second=randint(0, 30),
    ) + timedelta(days=index // len(upload_hours))

    scheduler.create_schedule(
        Name=f"{Key} upload schedule",
        ScheduleExpression=f"at({trigger_time.isoformat().replace("+00:00", "Z")})",
        FlexibleTimeWindow={"Mode": "OFF"},
        ActionAfterCompletion="DELETE",
        Target={
            "Arn": os.getenv("TARGET_ARN"),
            "Input": json.dumps({"bucket": bucket_name, "key": Key}),
            "RoleArn": os.getenv("TARGET_ROLE_ARN"),
        },
    )


def lambda_handler(event, context):
    try:
        data = json.loads(event["body"])
        bucket_name: str = data["bucket"]
        parent_key: str = data["parent_key"]
    except json.JSONDecodeError:
        return {"statusCode": 400, "body": "Invalid JSON in request body"}
    except KeyError:
        return {
            "statusCode": 400,
            "body": "Missing required fields: 'bucket' and 'parent_key'",
        }
    if not parent_key.endswith("/"):
        parent_key += "/"
    files = s3.list_objects_v2(Bucket=bucket_name, Prefix=parent_key, Delimiter="/")
    index_shift = get_upload_hour_index_shift(datetime.now(timezone.utc).hour)
    for index, file_key in enumerate(files.get("Content", [])):
        create_upload_schedule(scheduler, file_key, bucket_name, index + index_shift)

    return {"statusCode": 200, "body": "Upload schedules created successfully"}
