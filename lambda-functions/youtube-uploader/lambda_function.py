import os
import boto3
from google.oauth.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

creds = Credentials(
    token=None,
    refresh_token=os.getenv("YOUTUBE_REFRESH_TOKEN"),
    token_uri="https://oauth2.googleapis.com/token",
    client_id=os.getenv("CLIENT_ID"),
    client_secret=os.getenv("CLIENT_SECRET"),
)


def upload_to_youtube(file_path: str):
    youtube = build("youtube", "v3", credentials=creds)
    # TODO: use google's gemini to generate title and description
    request = youtube.videos().insert(
        part="snippet,status",
        body={"snippet": {"categoryId": "1"}, "status": {"privacyStatus": "public"}},
        media_body=MediaFileUpload(file_path, chunksize=-1, resumable=True),
    )
    response = request.execute()

    return response["id"]


s3 = boto3.client("s3")


def lambda_handler(event, context):
    bucket_name: str = event["bucket"]
    Key = event["key"]
    input_file_path = f"/tmp/{Key}"
    try:
        s3.download_file(Bucket=bucket_name, Key=Key, Filename=input_file_path)
        upload_to_youtube(input_file_path)
        s3.delete_object(Bucket=bucket_name, Key=Key)
    except Exception as err:
        pass

    os.remove(input_file_path)

    return {"status": 200}
