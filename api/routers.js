const express = require('express')
const router = express.Router()

const authRouter = require('./v1/auth/auth.routes');
const taskRouter = require('./v1/tasks/task.routes');

router.use('/auth', authRouter)
router.use('/task', taskRouter)

module.exports = router;