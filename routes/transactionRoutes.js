const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Fetch and initialize the database
router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    await Transaction.insertMany(transactions);
    res.status(200).send('Database initialized with seed data.');
  } catch (error) {
    res.status(500).send('Error fetching data from the third-party API.');
  }
});

// List all transactions with pagination and search
router.get('/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '' } = req.query;
  const query = {
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: { $regex: search, $options: 'i' } },
    ],
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);
    const totalCount = await Transaction.countDocuments(query);

    res.json({ transactions, totalCount });
  } catch (error) {
    res.status(500).send('Error fetching transactions.');
  }
});

// Statistics API
router.get('/statistics', async (req, res) => {
  const { month } = req.query;
  const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

  try {
    const totalSales = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
      { $group: { _id: null, total: { $sum: "$price" }, count: { $sum: 1 } } },
    ]);

    const totalSoldItems = totalSales.length ? totalSales[0].count : 0;
    const totalNotSoldItems = await Transaction.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      price: 0,  // Assuming 0 price indicates not sold
    });

    res.json({
      totalSale: totalSales.length ? totalSales[0].total : 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).send('Error calculating statistics.');
  }
});

// API to get bar chart data based on selected month
router.get('/bar-chart-data', async (req, res) => {
  const { month } = req.query;
  const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

  try {
    // Calculate price ranges and their counts
    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "900 above", min: 901, max: Infinity },
    ];

    const barChartData = [];

    for (const range of priceRanges) {
      const count = await Transaction.countDocuments({
        $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
        price: { $gte: range.min, $lt: range.max }
      });

      barChartData.push({
        priceRange: range.range,
        count
      });
    }

    res.json(barChartData);
  } catch (error) {
    res.status(500).send('Error fetching bar chart data.');
  }
});

module.exports = router;


