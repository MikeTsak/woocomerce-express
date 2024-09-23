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

  const { api, productIDs } = getWooCommerceApi(storeChoice);

  try {
    const apiResponse = await api.get("orders", {
      after: `${startDate}T00:00:00`,
      before: `${endDate}T23:59:59`,
      per_page: 100
    });

    console.log("API response:", apiResponse.data[0].billing.phone);

    const processedOrders = apiResponse.data.reduce((acc, order) => {
      // Filter line items by the specified productID
      const filteredItems = order.line_items.filter(item => productIDs.includes(item.product_id.toString()));

      // If the order contains relevant line items, process and add it to the accumulator
      if (filteredItems.length > 0) {
        // Calculate the total quantity of relevant items
        const totalQuantity = filteredItems.reduce((total, item) => total + item.quantity, 0);

        // Optionally, calculate the total value of relevant items
        // This might require additional info depending on how you want to calculate it

        acc.push({
          Name: `${order.billing.first_name} ${order.billing.last_name}`,
          PostalCode: order.billing.postcode,
          City: order.billing.city,
          Address: order.billing.address_1,
          // DeliveryMethod: order.shipping_lines[0].method_title,
          Phone: order.billing.phone,
          Quantity: totalQuantity,
          // If you have the item's price, you can calculate the total price of filteredItems here
          // Total: calculateTotal(filteredItems),
          Total: order.total, // Or use the total from the order if appropriate
          OrderDate: order.date_created,
          Email: order.billing.email || '-',
          PaymentMethod: order.payment_method_title,
          ProductId: filteredItems[0].product_id,
        });
      }

      return acc;
    }, []);

    // Generate the CSV file from the processed orders
    const csv = Papa.unparse(processedOrders, {
      header: true
    });

    // Set headers to download the file as a CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    // Send the generated CSV
    res.status(200).send(csv);
  } catch (error) {
    // Error handling remains the same
    console.error("Error during API call:", error);
    res.status(500).json({
      message: "Server encountered an error",
      errorDetails: error.message,
      additionalInfo: error.response ? error.response.data : 'No additional information'
    });
  }
});

app.get('/test', (req, res) => {
  res.send('Hello, this is the test route!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
