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

upload_hours = [21]


def get_upload_hour_index_shift(current_hour: int):
    starting_index = 0
    while (
        starting_index < len(upload_hours)
        and current_hour >= upload_hours[starting_index]
    ):
        starting_index += 1
    return starting_index


def create_upload_schedule(group_name: str, Key: str, bucket_name: str, index: int):
    trigger_hour_index = index % len(upload_hours)
    trigger_time = datetime.now(timezone.utc).replace(
        hour=upload_hours[trigger_hour_index],
        minute=randint(0, 10),
        second=randint(0, 30),
        microsecond=0,
    ) + timedelta(days=index // len(upload_hours))

    scheduler.create_schedule(
        Name=(Key.replace("/", "-").replace(".", "-") + "-")[:64],
        GroupName=group_name,
        ScheduleExpression=f"at({trigger_time.strftime('%Y-%m-%dT%H:%M:%S')})",
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
        bucket_name: str = event["bucket"]
        parent_key: str = event["parent_key"]
    except KeyError:
        return {
            "statusCode": 400,
            "body": "Missing required fields: 'bucket' and 'parent_key'",
        }
    if not parent_key.endswith("/"):
        parent_key += "/"
    files = s3.list_objects_v2(Bucket=bucket_name, Prefix=parent_key, Delimiter="/")
    index_shift = get_upload_hour_index_shift(datetime.now(timezone.utc).hour)
    files = files.get("Contents", [])
    scheduler_group_name = parent_key.strip("/").replace("/", "-")[:64]
    if files:
        try:
            scheduler.create_schedule_group(Name=scheduler_group_name)
        except scheduler.exceptions.ConflictException:
            pass
    for index, file in enumerate(files):
        create_upload_schedule(
            scheduler_group_name, file["Key"], bucket_name, index + index_shift
        )

    return {"statusCode": 200, "body": "Upload schedules created successfully"}
