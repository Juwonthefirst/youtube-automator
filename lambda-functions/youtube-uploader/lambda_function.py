import os
import boto3
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

creds = Credentials(
    token=None,
    refresh_token=os.getenv("YOUTUBE_REFRESH_TOKEN"),
    token_uri="https://oauth2.googleapis.com/token",
    client_id=os.getenv("CLIENT_ID"),
    client_secret=os.getenv("CLIENT_SECRET"),
)


def upload_to_youtube(file_path: str, title: str, description: str):
    youtube = build("youtube", "v3", credentials=creds)
    request = youtube.videos().insert(
        part="snippet,status",
        body={
            "snippet": {"categoryId": "1", "title": title, "description": description},
            "status": {"privacyStatus": "public"},
        },
        media_body=MediaFileUpload(file_path, chunksize=-1, resumable=True),
    )
    response = request.execute()

    return response["id"]


s3 = boto3.client(
    "s3",
    endpoint_url=os.getenv("S3_ENDPOINT_URL"),
    aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
    region_name="auto",
)


def lambda_handler(event, context):
    try:
        detail = event.get("detail", {})
        bucket_name: str = detail["bucket"]
        Key = detail["key"]
    except KeyError:
        return {"statusCode": 400, "message": "Invalid Event"}
    input_file_path = f"/tmp/{Key}"
    try:
        response = s3.head_object(Bucket=bucket_name, Key=Key)
        metadata: dict = response["Metadata"]
        s3.download_file(Bucket=bucket_name, Key=Key, Filename=input_file_path)
        upload_to_youtube(
            input_file_path, metadata.get("title", ""), metadata.get("description", "")
        )
        s3.delete_object(Bucket=bucket_name, Key=Key)
    except Exception as err:
        pass

    os.remove(input_file_path)

    return {"statusCode": 200}
