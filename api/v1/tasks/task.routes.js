const express = require('express');
const taskRouter = express.Router();
const taskController = require('./task.controller');
const { verifyToken } = require('../../module/middlewares/authPolicy');

taskRouter.use(verifyToken);

taskRouter.route('/')
.get(taskController.allTasks)

taskRouter.route('/new')
.post(taskController.createTask)

taskRouter.route('/latest')
.get(taskController.latestTask)

taskRouter.route('/:taskID')
.get(taskController.getTask)
.patch(taskController.updateTask)
.delete(taskController.deleteTask)

module.exports = taskRouter;