const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
//mongoose.connect('mongodb+srv://zaltebhumi:<db_password>@bhumidb.fuhkm.mongodb.net/?retryWrites=true&w=majority&appName=BHUMIDB', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect('mongodb+srv://zaltebhumi:XTqtbBOoX6pY4tWW@bhumidb.fuhkm.mongodb.net/?retryWrites=true&w=majority&appName=BHUMIDB', { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Integrate the transaction routes
const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

