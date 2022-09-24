const TaskModel = require('../../module/models/task.model');
const { sendResponse } = require('../../module/utils/response');
const moment = require('moment');
const { sendEmail } = require('../../module/utils/mailService');
const logger = require('../../module/utils/logger');

const taskController = {
    allTasks: async function (req, res) {
        try {
            let page = parseInt(req.query.page);
            let pageSize = parseInt(req.query.pageSize);
            if (page === 0) {
                return sendResponse(res, 400, false, "invalid page", null, "error");
            }
            const allTasks = await TaskModel.find({
                userId: req.userId,
                active: true
            }).skip((page - 1) * pageSize).limit(pageSize)
            return sendResponse(res, 200, true, "All tasks retrieved", allTasks, null);
        
        } catch (e) {
            logger.error(e);
            return sendResponse(res, 500, false, e.message, null, "error");
        }
    },

    createTask: async function (req, res) {
        try {
            const { title, description, startDateTime, endDateTime } = req.body;
            if (!title || !description || !startDateTime || !endDateTime) {
                return sendResponse(res, 400, false, "title & description are required", null, "error");
            }
            const newTask = await TaskModel.create({
                title: title,
                description: description,
                userId: req.userId,
                startDateTime: startDateTime,
                endDateTime: endDateTime
            })

            sendEmail({ 
                userEmail: req.userEmail,
                title: newTask.title, 
                description: newTask.description, 
                startDateTime: moment(newTask.startDateTime).format('MMMM Do YYYY, h:mm:ss a'),
                endDateTime: moment(newTask.endDateTime).format('MMMM Do YYYY, h:mm:ss a')
            });

            return sendResponse(res, 200, true, "Task Created!", {
                id: newTask.id,
                title: newTask.title,
                description: newTask.description,
                userId: newTask.userId,
                startDateTime: newTask.startDateTime,
                endDateTime: newTask.endDateTime
            }, null);
        } catch (e) {
            logger.error(e);
            return sendResponse(res, 500, false, e.message, null, "error");
        }
    },

    latestTask: async function (req, res) {
        try {
            const allTasks = await TaskModel.find({
                userId: req.userId,
                active: true
            });

            let latestTask = null;
            for (let i = 0; i < allTasks.length; i++) {
                let status = checkSessionTimeStatus(allTasks[i]);
                if (status === 'PRESENT' || status === 'FUTURE') {
                    latestTask = allTasks[i];
                    break;
                }
            }

            return sendResponse(res, 200, true, "Latest task retrieved", latestTask, null);

        } catch (e) {
            logger.error(e);
            return sendResponse(res, 500, false, e.message, null, "error");
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
            logger.error(e);
            return sendResponse(res, 500, false, e.message, null, "error");
        }
    },

    updateTask: async function (req, res) {
        try {
            const taskToBeUpdated = await TaskModel.findById(req.params.taskID);
            if (!taskToBeUpdated) {
                return sendResponse(res, 400, false, "Invalid task id", null, "error");
            }
            Object.keys(req.body).forEach(function (key) {
                if (taskToBeUpdated[key]) {
                    taskToBeUpdated[key] = req.body[key];
                }
            })
            await taskToBeUpdated.save();

            return sendResponse(res, 200, true, "Task updated", {
                id: taskToBeUpdated.id, 
                title: taskToBeUpdated.title,
                description: taskToBeUpdated.description,
                active: taskToBeUpdated.active,
                startDateTime: taskToBeUpdated.startDateTime,
                endDateTime: taskToBeUpdated.endDateTime
            });

        } catch (e) {
            logger.error(e);
            return sendResponse(res, 500, false, e.message, null, "error");
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
            logger.error(e);
            return sendResponse(res, 500, false, e.message, null, "error");
        }
    }
}

// helpers
function checkSessionTimeStatus (task) {
    const taskStartTime = moment(task.startDateTime);
    const taskEndTime = moment(task.endDateTime);
    const currentDateTime = moment();
    if (taskStartTime.diff(currentDateTime, "minutes") > 0) {
      return "FUTURE";
    } else if (
        taskStartTime.diff(currentDateTime, "minutes") <= 0 &&
        taskEndTime.diff(currentDateTime, "minutes") >= 0
    ) {
      return "PRESENT";
    } else {
      return "PAST";
    }
};

module.exports = taskController;