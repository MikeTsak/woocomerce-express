const express = require('express');
const bodyParser = require('body-parser');
const { getWooCommerceApi } = require('./utils/woocommerce');
const Papa = require('papaparse');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const VALID_PASSWORD = process.env.PASS;

app.use(express.static('public'));

app.post('/api/orders', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { storeChoice, startDate, endDate, password } = req.body;

  if (password !== VALID_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const api = getWooCommerceApi(storeChoice);

  try {
    const apiResponse = await api.get("orders", {
      after: `${startDate}T00:00:00`,
      before: `${endDate}T23:59:59`,
      per_page: 100
    });

    const processedOrders = apiResponse.data.map(order => ({
      Name: `${order.billing.first_name} ${order.billing.last_name}`,
      PostalCode: order.billing.postcode,
      City: order.billing.city,
      Address: order.billing.address_1,
      Phone: order.billing.phone,
      Quantity: order.line_items.reduce((total, item) => total + item.quantity, 0),
      Total: order.total,
      OrderDate: order.date_created,
      Email: order.billing.email || '-',
      PaymentMethod: order.payment_method_title
    }));

    const csv = Papa.unparse(processedOrders, {
      header: true
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error during API call:", error);
    res.status(500).json({
      message: "Server encountered an error",
      errorDetails: error.message,
      additionalInfo: error.response ? error.response.data : 'No additional information'
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
