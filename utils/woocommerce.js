const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

exports.getWooCommerceApi = (storeChoice) => {
  let url, consumerKey, consumerSecret;

  switch (storeChoice) {
    case '1':
      url = process.env.WOO_STORE_URL_BG;
      consumerKey = process.env.WOO_CONSUMER_KEY_BG;
      consumerSecret = process.env.WOO_CONSUMER_SECRET_BG;
      break;
    case '2':
      url = process.env.WOO_STORE_URL_GR;
      consumerKey = process.env.WOO_CONSUMER_KEY_GR;
      consumerSecret = process.env.WOO_CONSUMER_SECRET_GR;
      break;
    case '3':
      url = process.env.WOO_STORE_URL_RO;
      consumerKey = process.env.WOO_CONSUMER_KEY_RO;
      consumerSecret = process.env.WOO_CONSUMER_SECRET_RO;
      break;
    default:
      throw new Error("Invalid store choice");
  }

  return new WooCommerceRestApi({
    url,
    consumerKey,
    consumerSecret,
    version: 'wc/v3'
  });
};
