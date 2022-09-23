require('dotenv').config();
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');

const v1 = require('./api/routers');

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.use(bodyparser.json({
    limit: '50mb'
}))

app.use(bodyparser.urlencoded({
    limit: '50mb',
    extended: false
}))

app.use(bodyparser.raw({
    type: 'application/octet-stream',
    limit: '50mb'
}))

app.use('/api/v1', v1)

app.listen(process.env.PORT, function () {
    console.log('app listening at ', process.env.PORT)
})