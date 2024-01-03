require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./config/dbConn');
const { logger } = require('./middleware/logEvents');
const { errHandler } = require('./middleware/errHandler');
const { corsOptions } = require('./config/corsOptions');

const PORT = process.env.PORT || 5000;

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({extended : false}));
app.use(express.json());

app.use('/products', require('./routes/API/product'));

app.all('*', (req, res)=>{
    res.status(404).json({
        'message' : 'request not found'
    });
});

app.use(errHandler);

mongoose.connection.once('open', ()=>{
    console.log(`\nconnected to MongoDB ${process.env.DATABASE_URI}`);
    app.listen(PORT, ()=>{
        console.log(`server is running at port ${PORT} http://127.0.0.1:${PORT}/`)
    });
})