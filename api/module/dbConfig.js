require('dotenv').config()
const mongoose = require('mongoose');

function connectDb() {
    mongoose.connect(process.env.MONGO_DB_URL)
    .then(function () {
        console.log('Todo List DB Connected')
    }).catch (function (e) {
        console.log(e)
    })
}

module.exports = connectDb;