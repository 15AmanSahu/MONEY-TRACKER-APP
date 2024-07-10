const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/moneyTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Mongoose Schema
const moneySchema = new mongoose.Schema({
    category: String,
    amount: Number,
    info: String,
    date: Date,
});

const Money = mongoose.model('Money', moneySchema);

// POST Route to add new expense/income
app.post('/add', (req, res) => {
    const { category, amount, info, date } = req.body;

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).send('Invalid date format');
    }

    const newMoney = new Money({
        category,
        amount,
        info,
        date: parsedDate,
    });

    newMoney.save()
        .then(savedMoney => {
            console.log('Record Inserted Successfully:', savedMoney);
            res.status(200).json(savedMoney);
        })
        .catch(err => {
            console.error('Error inserting data into MongoDB:', err);
            res.status(500).send('Error inserting data into database');
        });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
