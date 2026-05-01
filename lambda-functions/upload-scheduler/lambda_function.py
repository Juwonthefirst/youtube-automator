import asyncio
from datetime import datetime, timedelta
import json
from random import random
from aioboto3 import Session


async def create_upload_schedule(scheduler, Key: str, bucket_name: str, index: int):
    # random acts noise to create inconsistent upload time
    upload_delay_in_hours = round(12 + (6 * random()))
    upload_delay_in_minutes = round(60 * random())
    upload_delay_in_seconds = round(60 * random())
    trigger_time = datetime.now() + timedelta(
        hours=index * upload_delay_in_hours,
        minutes=upload_delay_in_minutes if index >= 1 else 0,
        seconds=upload_delay_in_seconds if index >= 1 else 0,
    )
    # TODO: Add target fuction role arn and arn
    await scheduler.create_schedule(
        Name=f"{Key} Youtube upload schedule",
        ScheduleExpression=f"at({trigger_time.isoformat()})",
        FlexibleTimeWindow={"Mode": "OFF"},
        Target={
            "Arn": "",
            "Input": json.dumps({"bucket": bucket_name, "key": Key}),
            "RoleArn": "",
        },
    )


async def lambda_handler(event, context):
    aws_session = Session()
    schedule_requests = []
    bucket_name: str = event["bucket"]
    parent_key: str = event["parent_key"]
    if not parent_key.endswith("/"):
        parent_key += "/"
    async with aws_session.client("s3") as s3:
        files = await s3.list_objects_v2(
            Bucket=bucket_name, Prefix=parent_key, Delimiter="/"
        )
    async with aws_session.client("scheduler") as scheduler:
        for index, file_key in enumerate(files.get("Content", [])):
            schedule_requests.append(
                create_upload_schedule(scheduler, file_key, bucket_name, index)
            )
    await asyncio.gather(*schedule_requests)

    return {"status": 200}
