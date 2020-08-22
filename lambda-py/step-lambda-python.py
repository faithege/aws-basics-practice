import boto3  # python sdk
from os import environ  # required to extract environment vars

TABLE_NAME = environ['TABLE_NAME']
REGION = environ['AWS_REGION']


def handler(event, context):
    print(f'Received event {event}')

    dynamodb = boto3.resource('dynamodb', REGION)
    table = dynamodb.Table(TABLE_NAME)

    response = table.update_item(
      Key={
            'Id': event['id']  # can't use dot notation
      },
      UpdateExpression="ADD SeenCount :step",
      ExpressionAttributeValues={
            ':step': event.get('step', 1)  # the get function grabs the step parameter if it exists, otherwise assigns it a 1
      },
      ReturnValues="UPDATED_NEW"
    )
    print(f'Response {response}')
