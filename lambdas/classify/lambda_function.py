import boto3

import collector
import classifier


def dump_into_s3(data, file_name):
    joined = [','.join(result) for result in data]
    joined = '\n'.join(joined)
    s3 = boto3.resource("s3")
    bucket = s3.Bucket('classificationresults')
    bucket.put_object(Key=file_name, Body=joined)


def lambda_handler(event, context):
    tweets = collector.collect_tweets()
    logit = classifier.LogisticRegressionClassifier()
    prediction = logit.classify(tweets)
    message_id = event['Records'][0]['messageId']
    dump_into_s3(prediction, f"{message_id}.csv")
    