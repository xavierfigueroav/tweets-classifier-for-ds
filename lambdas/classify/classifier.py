import io
import os

import boto3
import joblib

from preprocesser import preprocess


class LogisticRegressionClassifier():
    def __init__(self):
        module_dir = os.path.dirname(__file__)
        self.models_dir = os.path.join(module_dir, 'models')
        self.load_model()
        super().__init__()

    def load_model(self):
        s3 = boto3.client('s3')
        response = s3.get_object(Bucket='predictionmodels', Key='logit.model')
        self.model = joblib.load(io.BytesIO(response['Body'].read()))

        response = s3.get_object(Bucket='predictionmodels', Key='tfidf.model')
        self.tfidf_model = joblib.load(io.BytesIO(response['Body'].read()))

    def load_data(self, data):
        ids = []
        tweets = []
        for tweet in data:
            tweet_id = tweet.get('id_str')
            tweet = tweet.get('full_text')
            ids.append(tweet_id)
            tweets.append(tweet)
        return ids, tweets

    def vectorize_tweets(self, data):
        return self.tfidf_model.transform(data).todense()

    def classify(self, tweets):
        ids, tweets = self.load_data(tweets)
        tweets = [preprocess(tweet) for tweet in tweets]

        if len(tweets) == 0:
            return []
        else:
            features = self.vectorize_tweets(tweets)
            labels = self.model.predict(features)
            results = []
            for id, label in zip(ids, labels):
                label = str(label)
                results.append((id, label))
            return results
