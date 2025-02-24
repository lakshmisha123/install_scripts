import boto3    
import datetime

REGION_VOLUME = "ap-south-1"
S3_BUCKET_NAME = "bucket-python-lamda"
VOLUME_ID = "vol-08e5c77a647f81540"
RETENTION_DAYS = 1

ec2_client = boto3.client("ec2", region_name=REGION_VOLUME)
s3_client = boto3.client("s3")

def lambda_handler(event, context):
    '''
    Create EBS snapshot, upload to S3, and delete old snapshots
    '''
    #save snapshot
    snapshot = ec2_client.create_snapshot(
        VolumeId=VOLUME_ID,
        Description=f"Backup created on {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        TagSpecifications=[{
            "ResourceType": "snapshot",
            "Tags": [{"Key": "Name", "Value": "AutoBackup"}]
        }]
    )

    snapshot_id = snapshot["SnapshotId"]
    print(f"Snapshot created: {snapshot_id}")

    # Save snapshot metadata to S3
    file_name = f"snapshot-{snapshot_id}.txt"
    file_content = f"Snapshot ID: {snapshot_id}\nCreated: {datetime.datetime.now()}\nVolume: {VOLUME_ID}"

    s3_client.put_object(
        Bucket=S3_BUCKET_NAME,
        Key=file_name,
        Body=file_content,
        ContentType="text/plain"
    )

    print(f"Snapshot metadata saved to S3: {file_name}")

    delete_old_snapshots()

    return {"status": "Snapshot automation completed", "snapshot_id": snapshot_id}

#delete old snapshot
def delete_old_snapshots():
    """Deletes snapshots older than the retention period."""
    print(f"Deleting snapshots older than {RETENTION_DAYS} days...")

    snapshots = ec2_client.describe_snapshots(
        Filters=[{"Name": "tag:Name", "Values": ["AutoBackup"]}]
    )["Snapshots"]

    cutoff_date = datetime.datetime.now() - datetime.timedelta(days=RETENTION_DAYS)

    for snapshot in snapshots:
        snapshot_id = snapshot["SnapshotId"]
        start_time = snapshot["StartTime"].replace(tzinfo=None)

        if start_time < cutoff_date:
            ec2_client.delete_snapshot(SnapshotId=snapshot_id)
            print(f"Deleted old snapshot: {snapshot_id}")
