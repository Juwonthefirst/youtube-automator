from urllib.parse import unquote_plus
import boto3

s3 = boto3.client("s3")


def lambda_handler(event, context):
    for event_record in event["Record"]:
        bucket_name: str = event_record["s3"]["bucket"]["name"]
        Key = unquote_plus(event_record["s3"]["object"]["key"])

        input_file_path = f"/tmp/{bucket_name}/{Key}"
        s3.download_file(Bucket=bucket_name, Key=Key, Filename=input_file_path)
        response = s3.head_object(Bucket=bucket_name, Key=Key)
        metadata = response["Metadata"]
