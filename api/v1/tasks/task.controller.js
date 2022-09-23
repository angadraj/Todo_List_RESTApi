const TaskModel = require('../../module/models/task.model');
const { sendResponse } = require('../../../utils/response');

const taskController = {
    allTasks: async function (req, res) {
        try {
            const { userId } = req.body;
            if (!userId) {
                return sendResponse(res, 400, false, "userId required in payload", null, "eror");
            }
            
        } catch (e) {
            console.log(e);
        }
    },

    createTask: async function (req, res) {
        try {

        } catch (e) {
            console.log(e);
        }
    },

    getTask: async function (req, res) {
        try {

        } catch (e) {
            console.log(e);
        }
    },

    updateTask: async function (req, res) {
        try {

        } catch (e) {
            console.log(e);
        }
    },

    deleteTask: async function (req, res) {
        try {

        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = taskController;