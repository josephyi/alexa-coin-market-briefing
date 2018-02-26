# alexa-coin-market-briefing

This is a feed generator for an Alexa flash briefing using data from coinmarketcap.com's API, implemented via AWS Lambda and S3 (and CloudWatch, which effectively makes the Lambda a cron job).

## What

Every 2 minutes, the Lambda fetches ticker data from coinmarketcap.com,
creates Alexa's flash briefing feed, and puts the feed into a S3 bucket.
This ensures coinmarketcap.com's API rate limit is never exceeded.

## Why

I thought it'd be fun to try a cron-triggered Lambda to keep the flash
briefing content fresh.

## How

TODO
