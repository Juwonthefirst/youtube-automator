import asyncio
from typing import Callable
from urllib.parse import unquote_plus


async def ffmpeg_process(file_paths: list[str], context: dict):
    commands = []
    for file_path in file_paths:
        await asyncio.create_subprocess_exec(["ffmpeg", "-i", file_path, *commands])
    return file_paths


def genetrate_ass_subtitles(file_paths: list[str], context: dict):
    return file_paths


pipeline: list[Callable[[list[str], dict], list[str]]] = [ffmpeg_process]


async def lambda_landler(event, context):
    for event_record in event["Record"]:
        bucket_name: str = event_record["s3"]["bucket"]["name"]
        Key = unquote_plus(event_record["s3"]["object"]["key"])
