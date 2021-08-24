import json
import boto3


def lambda_handler(event, context):
    client = boto3.client('s3')
    file_id = event['params']['querystring']['id']

    try:
        file = client.get_object(Bucket='classificationresults',Key=f'{file_id}.csv')
        file_data = file['Body'].read().decode('utf-8')
        data = {}
        for line in file_data.split('\n'):
            [id, label] = line.split(',')
            if label in data:
                data[label].append(id)
            else:
                data[label] = [id]
        return {
            'statusCode': 200,
            'data': json.dumps(data)
        }    
    except:
        return {
            'statusCode': 404,
            'body': json.dumps({'data': "File isn't ready yet"})
        }
