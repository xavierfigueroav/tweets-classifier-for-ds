from uuid import uuid4

import boto3


def collect_tweets():
    tweets = []
    s3 = boto3.client('s3')
    response = s3.get_object(Bucket='inputtweets', Key='data.csv')
    lines = response['Body'].iter_lines()
    next(lines)  # skip header
    for line in lines:
        date, text = line.decode('utf').strip().split(',')
        tweet = {'id_str': uuid4().hex, 'full_text': text}
        tweets.append(tweet)
    return tweets
