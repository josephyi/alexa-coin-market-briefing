# alexa-coin-market-briefing

This is a feed generator for an Alexa flash briefing powered by AWS Lambda
and S3 (and CloudWatch, which effectively makes the Lambda a cron job). Every
2 minutes, the Lambda fetches ticker data from coinmarketcap.com,
creates Alexa's flash briefing feed, and puts the feed into a S3 bucket,
ensuring it will never exceed coinmarketcap.com's API rate limit.
