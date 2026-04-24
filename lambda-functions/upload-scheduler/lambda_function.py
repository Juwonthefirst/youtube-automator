import asyncio
from datetime import datetime, timedelta
import json
from aioboto3 import Session


async def create_upload_schedule(scheduler, Key: str, bucket_name: str, index: int):
    upload_delay_in_hours = 12
    trigger_time = datetime.now() + timedelta(hours=index * upload_delay_in_hours)
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
    file_processes = []
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
            file_processes.append(
                create_upload_schedule(scheduler, file_key, bucket_name, index)
            )
    await asyncio.gather(*file_processes)

    return {"status": 200}
