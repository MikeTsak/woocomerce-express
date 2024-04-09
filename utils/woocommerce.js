const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

exports.getWooCommerceApi = (storeChoice) => {
  let url, consumerKey, consumerSecret;
  let productIDs;
  console.log('storeChoice', storeChoice, " - Mike you maybe forgot to add 'brack' in the case!");

  switch (storeChoice) {
    case '1':
      url = process.env.WOO_STORE_URL_BG;
      consumerKey = process.env.WOO_CONSUMER_KEY_BG;
      consumerSecret = process.env.WOO_CONSUMER_SECRET_BG;
      productIDs = ['682'];
      break;
    case '2':
      url = process.env.WOO_STORE_URL_GR;
      consumerKey = process.env.WOO_CONSUMER_KEY_GR;
      consumerSecret = process.env.WOO_CONSUMER_SECRET_GR;
      productIDs = ['682'];
      break;
    case '3':
      url = process.env.WOO_STORE_URL_RO;
      consumerKey = process.env.WOO_CONSUMER_KEY_RO;
      consumerSecret = process.env.WOO_CONSUMER_SECRET_RO;
      productIDs = ['682'];
      break;
    case '4':
      url = process.env.WOO_STORE_URL_MAISTOR_BG;
      consumerKey = process.env.WOO_CONSUMER_KEY_MAISTOR_BG;
      consumerSecret = process.env.WOO_CONSUMER_SECRET_MAISTOR_BG;
      productIDs = ['897', '988'];
      break;
    case '5':
      url = process.env.WOO_STORE_URL_MAISTOR_COMPACT;
      consumerKey = process.env.WOO_CONSUMER_KEY_MAISTOR_BG;
      consumerSecret = process.env.WOO_CONSUMER_SECRET_MAISTOR_BG;
      productIDs = ['1691', '1693'];
      break;
    case '6':
      url = process.env.WOO_STORE_URL_GRIPHOLD;
      consumerKey = process.env.WOO_CONSUMER_KEY_GRIPHOLD;
      consumerSecret = process.env.WOO_CONSUMER_SECRET_GRIPHOLD;
      productIDs = ['502', '397', '396', '395', '393', '392'];
      break;
    default:
      throw new Error("Invalid store choice");
  }

  return {
    api: new WooCommerceRestApi({
      url,
      consumerKey,
      consumerSecret,
      version: 'wc/v3'
    }),
    productIDs
  };
};
