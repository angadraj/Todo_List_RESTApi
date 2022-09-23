const mongoose = require('mongoose');
const connectDb = require('../dbConfig');

connectDb();

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: [30, 'Email should not exceed 30 Characters'],
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

const TaskModel = mongoose.model('TaskModel', taskSchema)
module.exports = TaskModel;