const express = require('express')
const authRouter = express.Router();
const authController = require('./auth.controller');

authRouter.route('/register')
.post(authController.register)

authRouter.route('/login')
.post(authController.login)

module.exports = authRouter;