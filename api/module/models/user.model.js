const mongoose = require('mongoose');
const connectDb = require('../dbConfig');

connectDb();

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        maxLength: [30, 'Email should not exceed 30 Characters'],
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must contain minimum 8 characters']
    },
    active: {
        type: Boolean,
        default: true
    },
    tasks: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'UserModel'
        }
    ]
})

const UserModel = mongoose.model('UserModel', userSchema)
module.exports = UserModel;