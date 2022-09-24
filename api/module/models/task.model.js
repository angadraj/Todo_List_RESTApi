const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: [30, 'Email should not exceed 30 Characters'],
    },
    active: {
        type: Boolean,
        default: true
    },
    startDateTime: {
        type: Date,
        default: Date.now()
    },
    endDateTime: {
        type: Date,
        default: Date.now()
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'UserModel'
    }
});


const TaskModel = mongoose.model('TaskModel', taskSchema)
module.exports = TaskModel;