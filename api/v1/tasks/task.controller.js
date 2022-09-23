const TaskModel = require('../../module/models/task.model');
const { sendResponse } = require('../../../utils/response');

const taskController = {
    allTasks: async function (req, res) {
        try {
            const allTasks = await TaskModel.find({
                userId: req.userId,
                active: true
            })
            return sendResponse(res, 200, true, "All tasks retrieved", allTasks, null);
        
        } catch (e) {
            console.log(e);
        }
    },

    createTask: async function (req, res) {
        try {
            const { title, description } = req.body;
            if (!title || !description) {
                return sendResponse(res, 400, false, "title & description are required", null, "error");
            }
            const newTask = await TaskModel.create({
                title: title,
                description: description,
                userId: req.userId
            })
            return sendResponse(res, 200, true, "Task Created!", {
                id: newTask.id,
                title: newTask.title,
                description: newTask.description,
                userId: newTask.userId
            }, null);
        } catch (e) {
            console.log(e);
        }
    },

    getTask: async function (req, res) {
        try {
            const task = await TaskModel.findById(req.params.taskID);
            if (!task) {
                return sendResponse(res, 400, false, "Task id invalid");
            }
            return sendResponse(res, 200, true, "Task retrieved", task, null);
        } catch (e) {
            console.log(e);
        }
    },

    updateTask: async function (req, res) {
        try {
            const { title, description} = req.body;
            if (!title || title === '' || !description || description === '') {
                return sendResponse(res, 400, false, "title & description are required", null);
            }
            const taskToBeUpdated = await TaskModel.findById(req.params.taskID);
            if (!taskToBeUpdated) {
                return sendResponse(res, 400, false, "Invalid task id", null, "error");
            }
            taskToBeUpdated.title = title;
            taskToBeUpdated.description = description;
            await taskToBeUpdated.save();

            return sendResponse(res, 200, true, "Task updated", {
                id: taskToBeUpdated.id, 
                title: taskToBeUpdated.title,
                description: taskToBeUpdated.description,
                active: taskToBeUpdated.active
            });

        } catch (e) {
            console.log(e);
        }
    },

    deleteTask: async function (req, res) {
        try {
            const taskToBeDeleted = await TaskModel.findById(req.params.taskID);
            if (!taskToBeDeleted) {
                return sendResponse(res, 400, false, "Invalid task id", null, "error");
            }
            taskToBeDeleted.active = 0;
            taskToBeDeleted.save();

            return sendResponse(res, 200, true, "Task deleted", {
                id: taskToBeDeleted.id, 
                title: taskToBeDeleted.title,
                description: taskToBeDeleted.description,
                active: taskToBeDeleted.active
            });


        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = taskController;