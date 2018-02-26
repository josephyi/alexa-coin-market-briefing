const rp = require("request-promise-native");
const { DateTime } = require("luxon");
const uuidv4 = require("uuid/v4");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const coinmarketRequest = (limit = 5) => {
  return rp({
    uri: `https://api.coinmarketcap.com/v1/ticker/`,
    qs: { limit },
    json: true
  });
};

const currencyFormatter = number => {
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const textForPercent = percentNumber => {
  if (percentNumber === 0) return "unchanged";
  else
    return `${percentNumber > 0 ? "up" : "down"} ${Math.abs(
      percentNumber
    )} percent`;
};

// if a price is ever given that's less than $0.01, the values may zero out.
const feedify = (entry, dateTime) => {
  const priceToNum = Number(entry.price_usd);
  const priceUSD = currencyFormatter(priceToNum);

  const percentChange24h = Number(entry.percent_change_24h);
  const percentChange7d = Number(entry.percent_change_7d);

  return {
    uid: uuidv4(),
    titleText: `${entry.name} (${entry.symbol}) - ${priceUSD} (${percentChange24h >
    0
      ? "+"
      : ""}${percentChange24h}%)`,
    updateDate: dateTime,
    mainText: `${entry.name} is trading at around ${priceUSD}, which is ${textForPercent(
      percentChange24h
    )} from yesterday, and ${textForPercent(percentChange7d)} from a week ago.`,
    redirectionUrl: `https://coinmarketcap.com/currencies/${entry.id}`
  };
};

exports.run = async (event, context) => {
  const response = await coinmarketRequest();
  const currentTime = DateTime.utc().toISO();
  const feed = response.map(entry => feedify(entry, currentTime));
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: process.env.OBJECT_KEY,
    Body: JSON.stringify(feed),
    ACL: "public-read",
    ContentType: "application/json"
  };
  const result = await s3.putObject(params).promise();
  console.log(`*** ${JSON.stringify(result)}`);
};
