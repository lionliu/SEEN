const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const app = express();

const uri = process.env.DB_CONNECTION;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected');
});


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/aps', require('./routes/aps'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server initialized in port: ${PORT}`));